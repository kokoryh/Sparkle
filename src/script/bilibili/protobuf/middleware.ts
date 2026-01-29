import { Logger } from '@core/logger';
import { createInitArgumentMiddleware, Middleware } from '@core/middleware';

export interface Argument {
    displayUpList: 'auto' | 'show' | 'hide';
    purifyComment: boolean | number;
    sponsorBlock: boolean | string;
}

export const initArgument: Middleware = createInitArgumentMiddleware<Argument>({
    displayUpList: 'show',
    purifyComment: true,
    sponsorBlock: true,
});

export const handleResponseHeaders: Middleware = (ctx, next) => {
    return next().then(() => {
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
