import * as Common from './common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultStateExtends = any;
export interface DefaultState extends DefaultStateExtends {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultArgumentExtends = any;
export interface DefaultArgument extends DefaultArgumentExtends {}

export interface HttpRequest extends Common.HttpRequest {
    body: string;
    bodyBytes: Uint8Array;
}

export interface HttpResponse extends Common.HttpResponse {
    body: string;
    bodyBytes: Uint8Array;
    h2_trailers: Common.HttpTrailers;
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
