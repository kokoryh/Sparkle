import { Logger } from '@core/logger';
import { createInitArgumentMiddleware, Middleware as DefaultMiddleware } from '@core/middleware';
import { DefaultState } from '@/types/context';

export interface Argument {
    displayUpList: 'auto' | 'show' | 'hide';
    purifyComment: boolean | number;
    sponsorBlock: boolean | string;
}

export type Middleware = DefaultMiddleware<DefaultState, Argument>;

export const initArgument: Middleware = createInitArgumentMiddleware<Argument>({
    displayUpList: 'show',
    purifyComment: true,
    sponsorBlock: true,
});

export const handleResponseHeaders: Middleware = (ctx, next) => {
    return next().then(() => {
        if (ctx.response.h2_trailers !== undefined) {
            return;
        }

        const engineType = ctx.request.headers['x-bili-moss-engine-type'];

        if (engineType === undefined) {
            return;
        }

        if (engineType !== '1') {
            Logger.error(`x-bili-moss-engine-type: ${engineType}`);
            return;
        }

        const responseHeaders = ctx.response.headers;
        if (!Object.hasOwn(responseHeaders, 'grpc-status')) {
            ctx.response.headers = { ...responseHeaders, 'grpc-status': '0' };
        }
    });
};

export const handleError: Middleware = (ctx, next) => {
    return next().catch(err => {
        Logger.error(err, { method: ctx.method, url: ctx.request.url, status: ctx.response.status });
    });
};
