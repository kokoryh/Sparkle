import { ungzip } from '@/utils';
import { DefaultState, DefaultArgument } from '@/types/context';
import { Context } from './context';
import { Logger } from './logger';

export type Next = () => Promise<void>;

export type Middleware<StateT extends DefaultState = DefaultState, ArgumentT = DefaultArgument> = (
    ctx: Context<StateT, ArgumentT>,
    next: Next
) => void | Promise<void>;

export const doneRequest: Middleware = (ctx, next) => {
    return next().then(() => {
        ctx.state.type = 'request';
    });
};

export const doneResponse: Middleware = (ctx, next) => {
    return next().then(() => {
        ctx.state.type = 'response';
    });
};

export const doneFakeResponse: Middleware = (ctx, next) => {
    return next().then(() => {
        ctx.state.type = 'fakeResponse';
    });
};

export const parseJSONRequest: Middleware = async (ctx, next) => {
    ctx.state.message = JSON.parse(ctx.request.body);
    await next();
    ctx.request.body = JSON.stringify(ctx.state.message);
};

export const parseJSONResponse: Middleware = async (ctx, next) => {
    ctx.state.message = JSON.parse(ctx.response.body);
    await next();
    ctx.response.body = JSON.stringify(ctx.state.message);
};

export const parseGRPCResponse: Middleware = async (ctx, next) => {
    let body = ctx.response.bodyBytes;
    ctx.response.bodyBytes = body[0] ? ungzip(body.subarray(5)) : body.subarray(5);
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

export const parseHTMLResponse: Middleware<{ message: Document }> = async (ctx, next) => {
    ctx.state.message = new DOMParser().parseFromString(ctx.response.body, 'text/html');
    await next();
    ctx.response.body = `<!DOCTYPE HTML>${ctx.state.message.documentElement.outerHTML}`;
};

export const createInitArgumentMiddleware: <T extends object>(argument: T) => Middleware = argument => (ctx, next) => {
    ctx.initArgument(argument);
    Logger.setLevel(String(ctx.argument.logLevel));
    Logger.debug('[Argument]', ctx.argument);
    return next();
};
