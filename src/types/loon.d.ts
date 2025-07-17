import * as Common from './common';
import * as Surge from './surge';

export type HttpBody = Surge.HttpBody;

export interface Script extends Omit<Surge.Script, 'type'> {}

export interface PersistentStore extends Surge.PersistentStore {
    remove: () => void;
}

export interface HttpClient extends Surge.HttpClient {}

export interface Utils extends Surge.Utils {}

export interface Notification {
    post: (title: string, subtitle: string, content: string, attach?: NotificationOptions, delay?: number) => void;
}

export interface HttpRequest extends Common.HttpRequest<HttpBody> {}

export interface HttpResponse extends Common.HttpResponse<HttpBody> {}

export interface HttpRequestDone extends Common.HttpRequestDone<HttpBody> {}

export interface HttpResponseDone extends Common.HttpResponseDone<HttpBody> {}

export type Done = (result?: HttpRequestDone | HttpResponseDone) => void;

export interface FetchRequest extends Surge.FetchRequest {}

export interface FetchResponse extends Surge.FetchResponse {}

export type NotificationOptions = Partial<{
    openUrl: string;
    mediaUrl: string;
    clipboard: string;
}>;
