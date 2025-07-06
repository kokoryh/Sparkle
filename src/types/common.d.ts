export type HttpHeaders = Record<string, string>;

export type HttpBody = string | Uint8Array;

export interface HttpRequest<T> {
    url: string;
    method: string;
    headers: HttpHeaders;
    body?: T;
}

export interface HttpResponse<T> {
    status: number;
    headers: HttpHeaders;
    body?: T;
}

export interface HttpRequestDone<T> {
    url?: string;
    headers?: HttpHeaders;
    body?: T;
}

export interface HttpResponseDone<T> {
    status?: number;
    headers?: HttpHeaders;
    body?: T;
}

export interface FetchRequest<T> {
    url: string;
    headers?: HttpHeaders;
    body?: T;
}

export interface FetchResponse {
    status: number;
    headers: HttpHeaders;
}
