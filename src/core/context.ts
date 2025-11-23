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
import { stringify } from '@utils/index';
import { toArrayBuffer, toUint8Array } from '@utils/binary';

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

    req = Object.create(null);
    res = Object.create(null);
    request: HttpRequest = Object.create(null);
    response: HttpResponse = Object.create(null);
    argument: object = Object.create(null);
    state: Record<string, any> = Object.create(null);
    protected logLevels = { debug: 1, info: 2, warn: 3, error: 4, off: 5 };
    protected logLevel = this.logLevels.error;
    private _url: URL | undefined;

    get url(): URL {
        if (!this._url) {
            this._url = new URL(this.request.url);
        }
        return this._url;
    }

    get method() {
        return this.request.method;
    }

    get path() {
        return this.url.pathname;
    }

    constructor() {
        if (typeof $request !== 'undefined') {
            this.req = $request;
            this.request = this.createRequest($request);
        }
        if (typeof $response !== 'undefined') {
            this.res = $response;
            this.response = this.createResponse($response);
        }
    }

    abstract createRequest(request: typeof $request): HttpRequest;

    abstract createResponse(response: typeof $response): HttpResponse;

    abstract createArgument(argument: object): void;

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

    logWithPrefix(prefix: string, logs: any[]): void {
        console.log(`${prefix}${logs.map(log => stringify(log)).join(' | ')}`);
    }

    log(...logs: any[]): void {
        this.logWithPrefix('', logs);
    }

    debug(...logs: any[]): void {
        if (this.logLevel > this.logLevels.debug) return;
        this.logWithPrefix('[DEBUG]', logs);
    }

    info(...logs: any[]): void {
        if (this.logLevel > this.logLevels.info) return;
        this.logWithPrefix('[INFO]', logs);
    }

    warn(...logs: any[]): void {
        if (this.logLevel > this.logLevels.warn) return;
        this.logWithPrefix('[WARN]', logs);
    }

    error(...logs: any[]): void {
        if (this.logLevel > this.logLevels.error) return;
        this.logWithPrefix('[ERROR]', logs);
    }

    exit(): void {
        $done({});
    }
}

export class SurgeContext extends Context {
    createRequest(request: typeof $request): HttpRequest {
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

    createResponse(response: typeof $response): HttpResponse {
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

    createArgument(argument: object): void {
        if (typeof $argument === 'string') {
            this.argument = Object.assign(argument, JSON.parse($argument));

            if ('logLevel' in this.argument) {
                this.logLevel = this.logLevels[this.argument.logLevel as string] ?? this.logLevels.error;
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
        result = { ...result };
        if ('response' in result) {
            result.response = { ...result.response };
        }
        ($done as Surge.Done)(result);
    }

    abort(): void {
        $done({ abort: true });
    }
}

export class LoonContext extends SurgeContext {
    override createArgument(argument: object): void {
        super.createArgument(argument);

        if (typeof $argument === 'object') {
            this.argument = Object.assign(argument, $argument);

            if ('logLevel' in this.argument) {
                this.logLevel = this.logLevels[this.argument.logLevel as string] ?? this.logLevels.error;
            }
        }
    }

    override fetch(request: FetchRequest): Promise<FetchResponse> {
        request.alpn = 'h2';
        request.timeout = (request.timeout ?? 5) * 1000;
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
    createRequest(request: typeof $request): HttpRequest {
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

    createArgument(argument: object): void {
        this.argument = argument;
    }

    getVal(key: string): string | null {
        return $prefs.valueForKey(key);
    }

    setVal(val: string, key: string): boolean {
        return $prefs.setValueForKey(val, key);
    }

    fetch(request: FetchRequest): Promise<FetchResponse> {
        const fetchRequest: QuantumultX.FetchRequest = {
            url: '',
            method: 'GET',
        };
        for (const [key, value] of Object.entries(request)) {
            if (key === 'body' && value instanceof Uint8Array) {
                fetchRequest.bodyBytes = toArrayBuffer(value);
            } else if (key === 'method') {
                fetchRequest.method = (value as string).toUpperCase();
            } else {
                fetchRequest[key] = value;
            }
        }
        return new Promise((resolve, reject) => {
            $task.fetch(fetchRequest).then(
                response => {
                    resolve(this.createResponse(response));
                },
                error => {
                    reject(error);
                }
            );
        });
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
