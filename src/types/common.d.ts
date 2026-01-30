export type HttpHeaders = Record<string, string>;

export type HttpBody = string | Uint8Array;

export type HttpTrailers = Record<string, string>;

export interface HttpRequest<T = HttpBody> {
    url: string;
    method: string;
    headers: HttpHeaders;
    body?: T;
}

export interface HttpResponse<T = HttpBody> {
    status: number;
    headers: HttpHeaders;
    body?: T;
    h2_trailers?: HttpTrailers;
}

export interface HttpRequestDone<T = HttpBody> {
    url?: string;
    headers?: HttpHeaders;
    body?: T;
}

export interface HttpResponseDone<T = HttpBody> {
    status?: number;
    headers?: HttpHeaders;
    body?: T;
    h2_trailers?: HttpTrailers;
}

export interface FetchRequest<T = HttpBody> {
    url: string;
    headers?: HttpHeaders;
    body?: T;
}

export interface FetchResponse {
    status: number;
    headers: HttpHeaders;
    h2_trailers: HttpTrailers;
}
