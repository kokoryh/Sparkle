import { Logger } from '@core/logger';
import { createInitArgumentMiddleware, Middleware } from '@core/middleware';

export interface Argument {
    displayUpList: 'auto' | 'show' | 'hide';
    purifyComment: boolean | number;
    sponsorBlock: boolean | string;
    enhancedCompatibility: boolean;
}

export const initArgument: Middleware = createInitArgumentMiddleware({
    displayUpList: 'show',
    purifyComment: true,
    sponsorBlock: true,
    enhancedCompatibility: false,
} as Argument);

export const handleResponseHeaders: Middleware = async (ctx, next) => {
    await next();
    const engineType = ctx.request.headers['x-bili-moss-engine-type'];
    if (typeof engineType === 'string' && engineType !== '1') {
        Logger.error(`x-bili-moss-engine-type: ${engineType}`);
    }
    if (engineType === '1' || ctx.argument.enhancedCompatibility) {
        const headers = ctx.response.headers;
        if (!Object.hasOwn(headers, 'grpc-status')) {
            ctx.response.headers = { ...headers, 'grpc-status': '0' };
        }
    }
};
