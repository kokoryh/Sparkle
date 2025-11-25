import { Context } from './context';

export type Next = () => Promise<void>;

export type Middleware = (ctx: Context, next: Next) => void | Promise<void>;

export const doneRequest: Middleware = async (ctx, next) => {
    await next();
    ctx.done(ctx.request);
};

export const doneResponse: Middleware = async (ctx, next) => {
    await next();
    ctx.done(ctx.response);
};

export const doneFakeResponse: Middleware = async (ctx, next) => {
    await next();
    ctx.done({ response: ctx.response });
};

export const parseJsonRequest: Middleware = async (ctx, next) => {
    ctx.state.message = JSON.parse(ctx.request.body);
    await next();
    ctx.request.body = JSON.stringify(ctx.state.message);
};

export const parseJsonResponse: Middleware = async (ctx, next) => {
    ctx.state.message = JSON.parse(ctx.response.body);
    await next();
    ctx.response.body = JSON.stringify(ctx.state.message);
};

export const parseGrpcResponse: Middleware = async (ctx, next) => {
    let body = ctx.response.bodyBytes;
    ctx.response.bodyBytes = body[0] ? ctx.ungzip(body.subarray(5)) : body.subarray(5);
    await next();
    body = ctx.response.bodyBytes;
    const length = body.length;
    const result = new Uint8Array(5 + length);
    result[0] = 0;
    result[1] = length >>> 24;
    result[2] = (length >>> 16) & 0xff;
    result[3] = (length >>> 8) & 0xff;
    result[4] = length & 0xff;
    result.set(body, 5);
    ctx.response.bodyBytes = result;
};

export const parseHtmlResponse: Middleware = async (ctx, next) => {
    ctx.state.message = new DOMParser().parseFromString(ctx.response.body, 'text/html');
    await next();
    ctx.response.body = `<!DOCTYPE HTML>${(ctx.state.message as Document).documentElement.outerHTML}`;
};

export const initArgument: (argument: object) => Middleware = argument => (ctx, next) => {
    ctx.initArgument(argument);
    ctx.debug('Argument:', ctx.argument);
    return next();
};
