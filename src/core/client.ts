import { gunzipSync } from 'fflate';
import * as Surge from 'src/types/surge';
import * as Loon from 'src/types/loon';
import * as QuantumultX from 'src/types/quantumult-x';
import {
    HttpRequest,
    HttpResponse,
    HttpRequestDone,
    HttpResponseDone,
    FetchRequest,
    FetchResponse,
    NotificationOptions,
} from 'src/types/client';
import { stringify } from '@utils/index';

export default abstract class Client {
    static getInstance(name?: string): Client {
        let className = 'Surge';
        if (typeof $loon !== 'undefined') {
            className = 'Loon';
        } else if (typeof $task !== 'undefined') {
            // className = 'QuantumultX';
            throw new Error('QuantumultX is not supported');
        }
        if (!Client.instances[className]) {
            Client.instances[className] = Client.classNames[className](name, className);
        }
        return Client.instances[className];
    }
    protected static classNames = {
        Surge: (name?: string, className?: string) => new SurgeClient(name, className),
        Loon: (name?: string, className?: string) => new LoonClient(name, className),
        // QuantumultX: (name?: string, className?: string) => new QuantumultXClient(name, className),
    };
    private static instances: Record<string, Client> = {};

    readonly className: string;
    protected name: string;
    protected logLevels = { debug: 1, info: 2, warn: 3, error: 4, off: 5 };
    protected logLevel = this.logLevels.error;
    request!: HttpRequest;
    response!: HttpResponse;
    argument: object | undefined;
    private _url: URL | undefined;

    get url(): URL {
        if (!this._url) {
            this._url = new URL(this.request.url);
        }
        return this._url;
    }

    constructor(name?: string, className?: string) {
        this.className = className ?? '';
        this.name = name ?? '';
        this.init();
    }

    protected abstract init(): void;

    abstract getVal(key: string): string | null;

    abstract setVal(val: string, key: string): void;

    abstract fetch(request: FetchRequest): Promise<FetchResponse>;

    abstract notify(title: string, subtitle: string, content: string, options?: NotificationOptions): void;

    abstract ungzip(data: Uint8Array): Uint8Array;

    abstract done(result: HttpRequestDone | HttpResponseDone): void;

    protected createProxy<T extends object, C extends object>(target: T): C {
        return new Proxy(target, {
            get: this.getFn,
            set: this.setFn,
        }) as unknown as C;
    }

    protected getFn<T extends object>(target: T, property: string, receiver: any): any {
        return Reflect.get(target, property, receiver);
    }

    protected setFn<T extends object>(target: T, property: string, value: any, receiver: any): boolean {
        Reflect.set(target, property, value, receiver);
        return true;
    }

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

    abort(): void {
        $done();
    }
}

export class SurgeClient extends Client {
    static propertyMap: Record<string, string> = {
        bodyBytes: 'body',
    };

    protected override getFn<T extends object>(target: T, property: string, receiver: any): any {
        const mappedProperty = SurgeClient.propertyMap[property] || property;
        return super.getFn(target, mappedProperty, receiver);
    }

    protected override setFn<T extends object>(target: T, property: string, value: any, receiver: any): boolean {
        const mappedProperty = SurgeClient.propertyMap[property] || property;
        return super.setFn(target, mappedProperty, value, receiver);
    }

    protected init(): void {
        if (typeof $request === 'object') {
            this.request = this.createProxy<Surge.HttpRequest, HttpRequest>($request as Surge.HttpRequest);
        }
        if (typeof $response === 'object') {
            this.response = this.createProxy<Surge.HttpResponse, HttpResponse>($response as Surge.HttpResponse);
        }
        if (typeof $argument === 'string') {
            this.argument = JSON.parse($argument) as object;

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
            $httpClient[method](
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
                    const body = data instanceof Uint8Array ? 'bodyBytes' : 'body';
                    resolve({
                        status: response.status,
                        headers: response.headers,
                        [body]: data,
                    });
                }
            );
        });
    }

    notify(title = this.name, subtitle = '', content = '', options: NotificationOptions = {}): void {
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
        ($done as Surge.Done)(result);
    }

    override abort(): void {
        $done({ abort: true });
    }
}

export class LoonClient extends SurgeClient {
    protected override init(): void {
        super.init();

        if (typeof $argument === 'object') {
            this.argument = $argument;

            if ('logLevel' in this.argument) {
                this.logLevel = this.logLevels[this.argument.logLevel as string] ?? this.logLevels.error;
            }
        }
    }

    override fetch(request: FetchRequest): Promise<FetchResponse> {
        request.timeout = (request.timeout ?? 5) * 1000;
        return super.fetch(request);
    }

    override notify(title = this.name, subtitle = '', content = '', options: NotificationOptions = {}): void {
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

export class QuantumultXClient extends Client {
    static propertyMap: Record<string, string> = {
        status: 'statusCode',
    };

    static toUint8Array(bodyBytes: ArrayBuffer | undefined): Uint8Array | undefined {
        return bodyBytes ? new Uint8Array(bodyBytes) : bodyBytes;
    }

    static toArrayBuffer(bodyBytes: Uint8Array): ArrayBuffer {
        return bodyBytes.buffer.slice(bodyBytes.byteOffset, bodyBytes.byteLength + bodyBytes.byteOffset) as ArrayBuffer;
    }

    protected override getFn<T extends object>(target: T, property: string, receiver: any): any {
        const mappedProperty = QuantumultXClient.propertyMap[property] || property;
        const value = super.getFn(target, mappedProperty, receiver);
        return property === 'bodyBytes' ? QuantumultXClient.toUint8Array(value) : value;
    }

    protected init(): void {
        if (typeof $request === 'object') {
            this.request = this.createProxy<QuantumultX.HttpRequest, HttpRequest>($request as QuantumultX.HttpRequest);
        }
        if (typeof $response === 'object') {
            this.response = this.createProxy<QuantumultX.HttpResponse, HttpResponse>(
                $response as QuantumultX.HttpResponse
            );
        }
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
                fetchRequest.bodyBytes = QuantumultXClient.toArrayBuffer(value);
            } else if (key === 'method') {
                fetchRequest.method = (value as string).toUpperCase();
            } else {
                fetchRequest[key] = value;
            }
        }
        return new Promise((resolve, reject) => {
            $task.fetch(fetchRequest).then(
                response => {
                    resolve(this.createProxy(response));
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    notify(title = this.name, subtitle = '', message = '', options: NotificationOptions = {}): void {
        const { openUrl, mediaUrl, clipboard } = options;
        const opts: QuantumultX.NotifyOptions = {
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
        const source = (result as HttpRequestDone).response ?? result;
        const target: QuantumultX.HttpRequestDone | QuantumultX.HttpResponseDone = {};
        for (const [key, value] of Object.entries(source)) {
            if (key === 'status') {
                (target as QuantumultX.HttpResponseDone).status = `HTTP/1.1 ${value as number}`;
            } else if (key === 'body' && value instanceof Uint8Array) {
                target.bodyBytes = QuantumultXClient.toArrayBuffer(value);
            } else {
                target[key] = value;
            }
        }
        $done(target);
    }
}
