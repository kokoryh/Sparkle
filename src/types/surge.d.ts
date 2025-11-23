import * as Common from './common';

export type HttpBody = Common.HttpBody;

export interface Network {
    'cellular-data': {
        carrier: string | null;
        radio: string;
    };
    wifi: {
        bssid: string | null;
        ssid: string | null;
    };
    dns: string[];
    v4: {
        primaryAddress: string;
        primaryInterface: string;
        primaryRouter: string;
    };
    v6: {
        primaryAddress: string | null;
        primaryInterface: string | null;
    };
}

export interface Script {
    name: string;
    startTime: Date;
    type: string;
}

export interface Environment {
    system: string;
    ['surge-build']: string;
    ['surge-version']: string;
    language: string;
    ['device-model']: string;
}

export interface PersistentStore {
    write: (data: string, key?: string) => boolean;
    read: (key?: string) => string | null;
}

export type HttpAPI = (method: string, path: string, body: object, callback: (result: object) => void) => void;

export interface HttpClient {
    get: (options: FetchRequest, callback: (error: unknown, response: FetchResponse, data: HttpBody) => void) => void;
    post: (options: FetchRequest, callback: (error: unknown, response: FetchResponse, data: HttpBody) => void) => void;
}

export interface Utils {
    geoip: (ip: string) => string;
    ipasn: (ip: string) => string;
    ipaso: (ip: string) => string;
    ungzip: (binary: Uint8Array) => Uint8Array;
}

export interface Notification {
    post: (title: string, subtitle: string, body: string, options?: NotificationOptions) => void;
}

export interface HttpRequest extends Common.HttpRequest {}

export interface HttpResponse extends Common.HttpResponse {}

export interface HttpRequestDone extends Common.HttpRequestDone {
    response?: Omit<HttpResponseDone, 'abort'>;
    abort?: boolean;
}

export interface HttpResponseDone extends Common.HttpResponseDone {
    abort?: boolean;
}

export type Done = (result?: HttpRequestDone | HttpResponseDone) => void;

export interface FetchRequest extends Common.FetchRequest {
    ['binary-mode']?: boolean;
    timeout?: number;
}

export interface FetchResponse extends Common.FetchResponse {}

export type NotificationOptions = Partial<{
    action: 'open-url' | 'clipboard';
    url: string;
    text: string;
    'media-url': string;
    'media-base64': string;
    'auto-dismiss': number;
    sound: boolean;
}>;
