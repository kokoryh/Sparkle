import * as Common from './common';

export interface HttpRequest extends Common.HttpRequest {
    body: string;
    bodyBytes: Uint8Array;
}

export interface HttpResponse extends Common.HttpResponse {
    body: string;
    bodyBytes: Uint8Array;
}

export interface HttpRequestDone extends Common.HttpRequestDone {
    response?: HttpResponseDone;
}

export interface HttpResponseDone extends Common.HttpResponseDone {}

export interface FetchRequest extends Common.FetchRequest {
    method: string;
    timeout?: number;
    alpn?: 'h1' | 'h2';
}

export interface FetchResponse extends Common.FetchResponse {
    body: string;
    bodyBytes: Uint8Array;
}

export type NotificationOptions = Partial<{
    openUrl: string;
    clipboard: string;
    mediaUrl: string;
    delay: number;
    dismiss: number;
    sound: boolean;
}>;
