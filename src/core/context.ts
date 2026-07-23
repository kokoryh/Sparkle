import * as Surge from '@/types/surge';
import * as Loon from '@/types/loon';
import * as QuantumultX from '@/types/quantumult-x';
import {
    HttpRequest,
    HttpResponse,
    HttpRequestDone,
    HttpResponseDone,
    FetchRequest,
    FetchResponse,
    NotificationOptions,
    DefaultState,
    DefaultArgument,
} from '@/types/context';
import { toArrayBuffer, toUint8Array, isUint8Array } from '@/utils';
import { Logger } from './logger';
import { AbortError, ExitError } from './process';

export abstract class Context<StateT = DefaultState, ArgumentT = DefaultArgument> {
    static createInstance(): Context {
        if (typeof $loon !== 'undefined') return new LoonContext();
        if (typeof $task !== 'undefined') throw new Error('QuantumultX is not supported');
        return new SurgeContext();
    }

    readonly request: HttpRequest;
    readonly response: HttpResponse;
    readonly state: StateT = {} as StateT;
    readonly argument: ArgumentT = {} as ArgumentT;

    type: 'request' | 'response' | 'fakeResponse' | 'abort' | 'exit' = 'exit';

    #url: URL | undefined;

    get url(): URL {
        if (!this.#url) this.#url = new URL(this.request.url);
        return this.#url;
    }

    get path() {
        return this.url.pathname;
    }

    get method() {
        return this.request.method;
    }

    constructor() {
        this.request = this.createRequest(typeof $request !== 'undefined' ? $request : null);
        this.response = this.createResponse(typeof $response !== 'undefined' ? $response : null);
    }

    abstract createRequest(request: typeof $request | null): HttpRequest;

    abstract createResponse(response: typeof $response | null): HttpResponse;

    abstract initArgument(argument: object): void;

    abstract getVal(key: string): string | null;

    abstract setVal(val: string, key: string): void;

    abstract fetch(request: FetchRequest): Promise<FetchResponse>;

    abstract notify(title: string, subtitle: string, content: string, options?: NotificationOptions): void;

    abstract done(result: HttpRequestDone | HttpResponseDone): void;

    abstract abort(): void;

    getJSON(key: string): object | null {
        const val = this.getVal(key);
        return val ? JSON.parse(val) : null;
    }

    setJSON(val: object, key: string): void {
        this.setVal(JSON.stringify(val), key);
    }

    exit(): void {
        $done({});
    }

    finish(): void {
        if (this.type === 'request') {
            this.done(this.request);
        } else if (this.type === 'response') {
            this.done(this.response);
        } else if (this.type === 'fakeResponse') {
            this.done({ response: this.response });
        } else if (this.type === 'abort') {
            this.abort();
        } else {
            this.exit();
        }
    }

    onerror(err: unknown): void {
        if (err instanceof AbortError) {
            this.type = 'abort';
            return;
        }

        this.type = 'exit';

        if (err instanceof ExitError) {
            if (err.code !== 0) Logger.error(err.toString());
            return;
        }

        Logger.error(err, this.toString());
    }

    toString(): string {
        const { method, url } = this.request;
        const { status, body } = this.response;
        return JSON.stringify({ method, url, status, body });
    }
}

export class SurgeContext extends Context {
    createRequest(request: typeof $request | null): HttpRequest {
        return Object.create(request, {
            bodyBytes: {
                get() {
                    return this.body;
                },
                set(value) {
                    this.body = value;
                },
            },
        });
    }

    createResponse(response: typeof $response | null): HttpResponse {
        return Object.create(response, {
            bodyBytes: {
                get() {
                    return this.body;
                },
                set(value) {
                    this.body = value;
                },
            },
        });
    }

    initArgument(argument: object): void {
        Object.assign(this.argument, argument);

        if (typeof $argument === 'string') {
            try {
                Object.assign(this.argument, JSON.parse($argument));
            } catch (e) {
                Logger.log(e);
            }
        }
    }

    getVal(key: string): string | null {
        return $persistentStore.read(key);
    }

    setVal(val: string, key: string): boolean {
        return $persistentStore.write(val, key);
    }

    fetch(request: FetchRequest): Promise<FetchResponse> {
        const { method, body, timeout = 5, ...rest } = request;
        return new Promise((resolve, reject) => {
            $httpClient[method.toLowerCase() as keyof typeof $httpClient](
                {
                    ...rest,
                    body,
                    'binary-mode': isUint8Array(body),
                    timeout,
                },
                (error: unknown, response: Surge.FetchResponse, data: Surge.HttpBody) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(this.createResponse({ ...response, body: data }));
                }
            );
        });
    }

    notify(title = '', subtitle = '', content = '', options: NotificationOptions = {}): void {
        const { openUrl, clipboard, mediaUrl, dismiss, sound = true } = options;
        const opts: Surge.NotificationOptions = {
            url: openUrl,
            text: clipboard,
            'media-url': mediaUrl,
            'auto-dismiss': dismiss,
            sound,
        };
        if (openUrl) {
            opts.action = 'open-url';
        } else if (clipboard) {
            opts.action = 'clipboard';
        }
        $notification.post(title, subtitle, content, opts);
    }

    done(result: HttpRequestDone | HttpResponseDone): void {
        ($done as Surge.Done)({ ...result });
    }

    abort(): void {
        $done({ abort: true });
    }
}

export class LoonContext extends SurgeContext {
    override initArgument(argument: object): void {
        super.initArgument(argument);

        if (typeof $argument === 'object') {
            Object.assign(this.argument, $argument);
        }
    }

    override fetch(request: FetchRequest): Promise<FetchResponse> {
        request.timeout = (request.timeout ?? 5) * 1000;
        request.alpn = 'h2';
        return super.fetch(request);
    }

    override notify(title = '', subtitle = '', content = '', options: NotificationOptions = {}): void {
        const { openUrl, mediaUrl, clipboard, delay } = options;
        const opts: Loon.NotificationOptions = {
            openUrl: openUrl,
            mediaUrl: mediaUrl,
            clipboard: clipboard,
        };
        $notification.post(title, subtitle, content, opts, delay);
    }

    override abort(): void {
        $done();
    }
}

export class QuantumultXContext extends Context {
    createRequest(request: typeof $request | null): HttpRequest {
        return Object.create(request, {
            bodyBytes: {
                get() {
                    if (this.body instanceof Uint8Array) {
                        return this.body;
                    }
                    return toUint8Array(Object.getPrototypeOf(this).bodyBytes);
                },
                set(value) {
                    this.body = value;
                },
            },
        });
    }

    createResponse(response: QuantumultX.HttpResponse): HttpResponse {
        return Object.create(response, {
            status: {
                get() {
                    return this.statusCode;
                },
                set(value) {
                    this.statusCode = value;
                },
            },
            bodyBytes: {
                get() {
                    if (this.body instanceof Uint8Array) {
                        return this.body;
                    }
                    return toUint8Array(Object.getPrototypeOf(this).bodyBytes);
                },
                set(value) {
                    this.body = value;
                },
            },
        });
    }

    initArgument(argument: object): void {
        Object.assign(this.argument, argument);
    }

    getVal(key: string): string | null {
        return $prefs.valueForKey(key);
    }

    setVal(val: string, key: string): boolean {
        return $prefs.setValueForKey(val, key);
    }

    fetch(fetchRequest: FetchRequest): Promise<FetchResponse> {
        const request: QuantumultX.FetchRequest = {
            url: '',
            method: 'GET',
        };
        for (const [key, value] of Object.entries(fetchRequest)) {
            if (key === 'body' && value instanceof Uint8Array) {
                request.bodyBytes = toArrayBuffer(value);
            } else if (key === 'method') {
                request.method = (value as string).toUpperCase();
            } else {
                request[key as keyof QuantumultX.FetchRequest] = value;
            }
        }
        return $task.fetch(request).then(response => this.createResponse(response));
    }

    notify(title = '', subtitle = '', message = '', options: NotificationOptions = {}): void {
        const { openUrl, mediaUrl, clipboard } = options;
        const opts: QuantumultX.NotificationOptions = {
            'open-url': openUrl,
            'media-url': mediaUrl,
            'update-pasteboard': clipboard,
        };
        $notify(title, subtitle, message, opts);
    }

    done(result: HttpRequestDone | HttpResponseDone): void {
        const source = Object.assign({}, (result as HttpRequestDone).response || result);
        const target: QuantumultX.HttpRequestDone | QuantumultX.HttpResponseDone = {};
        for (const [key, value] of Object.entries(source)) {
            if (key === 'statusCode') {
                (target as QuantumultX.HttpResponseDone).status = `HTTP/1.1 ${value as number}`;
            } else if (key === 'body' && value instanceof Uint8Array) {
                target.bodyBytes = toArrayBuffer(value);
            } else {
                (target as Record<string, unknown>)[key] = value;
            }
        }
        $done(target);
    }

    abort(): void {
        $done();
    }
}
