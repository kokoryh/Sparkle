import { setupArgumentFactory, Middleware as CoreMiddleware } from '@core/middleware';
import { DefaultState } from '@/types/context';

export interface Argument {
    displayUpList: 'auto' | 'show' | 'hide';
    purifyComment: boolean | number;
    sponsorBlock: boolean | string;
}

export type Middleware = CoreMiddleware<DefaultState, Argument>;

export const setupArgument: Middleware = setupArgumentFactory<Argument>({
    displayUpList: 'show',
    purifyComment: true,
    sponsorBlock: true,
});

export const fixResponseHeaders: Middleware = (ctx, next) => {
    return next().then(() => {
        if (ctx.response.h2_trailers !== undefined) {
            return;
        }

        if (ctx.request.headers['te'] !== 'trailers') {
            return;
        }

        const responseHeaders = ctx.response.headers;
        if (!Object.hasOwn(responseHeaders, 'grpc-status')) {
            ctx.response.headers = { ...responseHeaders, 'grpc-status': '0' };
        }
    });
};
