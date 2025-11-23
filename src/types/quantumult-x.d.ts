import * as Common from './common';

export interface Prefs {
    valueForKey: (key: string) => string | null;
    setValueForKey: (value: string, key: string) => boolean;
    removeValueForKey: (key: string) => boolean;
    removeAllValues: () => boolean;
}

export interface Task {
    fetch: (request: FetchRequest) => Promise<FetchResponse>;
}

export type Notify = (title: string, subtitle: string, message: string, options?: NotificationOptions) => void;

export interface HttpRequest extends Common.HttpRequest<string> {
    scheme: string;
    path: string;
    bodyBytes?: ArrayBuffer;
}

export interface HttpResponse extends Omit<Common.HttpResponse<string>, 'status'> {
    statusCode: number;
    bodyBytes?: ArrayBuffer;
}

export interface HttpRequestDone extends Common.HttpRequestDone<string> {
    bodyBytes?: ArrayBuffer;
}

export interface HttpResponseDone extends Omit<Common.HttpResponseDone<string>, 'status'> {
    status?: string;
    bodyBytes?: ArrayBuffer;
}

export type Done = (result?: HttpRequestDone | HttpResponseDone) => void;

export interface FetchRequest extends Common.FetchRequest<string> {
    url: string;
    method?: string;
    bodyBytes?: ArrayBuffer;
}

export interface FetchResponse {
    statusCode: number;
    headers: Common.HttpHeaders;
    body?: string;
    bodyBytes?: ArrayBuffer;
}

export type NotificationOptions = Partial<{
    'open-url': string;
    'media-url': string;
    'update-pasteboard': string;
}>;
