import { gunzipSync } from 'fflate';
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
} from '@/types/context';
import { toString, toArrayBuffer, toUint8Array } from '@utils/index';

export abstract class Context {
    static getInstance(): Context {
        if (!Context.instance) {
            let className = 'Surge';
            if (typeof $loon !== 'undefined') {
                className = 'Loon';
            } else if (typeof $task !== 'undefined') {
                throw new Error('QuantumultX is not supported');
            }
            Context.instance = Context.classNames[className]();
        }
        return Context.instance;
    }
    static classNames = {
        Surge: () => new SurgeContext(),
        Loon: () => new LoonContext(),
    };
    private static instance: Context;

    readonly request: HttpRequest;
    readonly response: HttpResponse;
    readonly argument: object = Object.create(null);
    readonly state: Record<string, any> = Object.create(null);
    protected logLevels = { debug: 1, info: 2, warn: 3, error: 4, off: 5 };
    protected logLevel = this.logLevels.error;
    private _url: URL | undefined;

    get url(): URL {
        if (!this._url) this._url = new URL(this.request.url);
        return this._url;
    }

    get path() {
        return this.url.pathname;
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

    abstract ungzip(data: Uint8Array): Uint8Array;

    abstract done(result: HttpRequestDone | HttpResponseDone): void;

    abstract abort(): void;

    getJSON(key: string): object | null {
        const val = this.getVal(key);
        return val ? JSON.parse(val) : null;
    }

    setJSON(val: object, key: string): void {
        this.setVal(JSON.stringify(val), key);
    }

    log(...messages: any[]): void {
        console.log(messages.map(msg => toString(msg)).join(' '));
    }

    debug(...messages: any[]): void {
        if (this.logLevel > this.logLevels.debug) return;
        this.log('[DEBUG]', ...messages);
    }

    info(...messages: any[]): void {
        if (this.logLevel > this.logLevels.info) return;
        this.log('[INFO]', ...messages);
    }

    warn(...messages: any[]): void {
        if (this.logLevel > this.logLevels.warn) return;
        this.log('[WARN]', ...messages);
    }

    error(...messages: any[]): void {
        if (this.logLevel > this.logLevels.error) return;
        this.log('[ERROR]', ...messages);
    }

    exit(): void {
        $done({});
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
                console.log(e);
            }

            if ('logLevel' in this.argument) {
                this.logLevel = Number(this.argument.logLevel) ?? this.logLevels.error;
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
            $httpClient[method.toLowerCase()](
                {
                    ...rest,
                    body,
                    'binary-mode': body instanceof Uint8Array,
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

    ungzip(data: Uint8Array): Uint8Array {
        return $utils.ungzip(data);
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

            if ('logLevel' in this.argument) {
                this.logLevel = this.logLevels[this.argument.logLevel as string] ?? this.logLevels.error;
            }
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
                request[key] = value;
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

    ungzip(data: Uint8Array): Uint8Array {
        return gunzipSync(data);
    }

    done(result: HttpRequestDone | HttpResponseDone): void {
        const source = Object.assign({}, (result as HttpRequestDone).response ?? result);
        const target: QuantumultX.HttpRequestDone | QuantumultX.HttpResponseDone = {};
        for (const [key, value] of Object.entries(source)) {
            if (key === 'statusCode') {
                (target as QuantumultX.HttpResponseDone).status = `HTTP/1.1 ${value as number}`;
            } else if (key === 'body' && value instanceof Uint8Array) {
                target.bodyBytes = toArrayBuffer(value);
            } else {
                target[key] = value;
            }
        }
        $done(target);
    }

    abort(): void {
        $done();
    }
}
