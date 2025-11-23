import * as Common from './common';
import * as Surge from './surge';

export interface Script extends Omit<Surge.Script, 'type'> {}

export interface PersistentStore extends Surge.PersistentStore {
    remove: () => void;
}

export interface HttpClient extends Surge.HttpClient {}

export interface Utils extends Surge.Utils {}

export interface Notification {
    post: (title: string, subtitle: string, content: string, attach?: NotificationOptions, delay?: number) => void;
}

export interface HttpRequest extends Common.HttpRequest {}

export interface HttpResponse extends Common.HttpResponse {}

export interface HttpRequestDone extends Common.HttpRequestDone {}

export interface HttpResponseDone extends Common.HttpResponseDone {}

export type Done = (result?: HttpRequestDone | HttpResponseDone) => void;

export interface FetchRequest extends Surge.FetchRequest {
    alpn?: 'h1' | 'h2';
}

export interface FetchResponse extends Surge.FetchResponse {}

export type NotificationOptions = Partial<{
    openUrl: string;
    mediaUrl: string;
    clipboard: string;
}>;
