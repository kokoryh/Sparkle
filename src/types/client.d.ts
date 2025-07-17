import * as Common from './common';

export type HttpBody = Common.HttpBody;

export interface HttpRequest extends Common.HttpRequest<HttpBody> {
    bodyBytes?: Uint8Array;
}

export interface HttpResponse extends Common.HttpResponse<HttpBody> {
    bodyBytes?: Uint8Array;
}

export interface HttpRequestDone extends Common.HttpRequestDone<HttpBody> {
    response?: HttpResponseDone;
}

export interface HttpResponseDone extends Common.HttpResponseDone<HttpBody> {}

export interface FetchRequest extends Common.FetchRequest<HttpBody> {
    method: string;
    timeout?: number;
}

export interface FetchResponse extends Common.FetchResponse {
    body?: HttpBody;
    bodyBytes?: Uint8Array;
}

export type NotificationOptions = Partial<{
    openUrl: string;
    mediaUrl: string;
    clipboard: string;
    delay: number;
    dismiss: number;
    sound: boolean;
}>;
