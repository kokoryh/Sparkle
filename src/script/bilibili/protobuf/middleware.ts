import { setupArgumentFactory, Middleware as CoreMiddleware } from '@core/middleware';

export enum BiliVariant {
    UNIVERSAL = 'universal',
    BLUE = 'blue',
    OVERSEAS = 'overseas',
    INTER = 'inter',
    HD2 = 'hd2',
}

export interface State {
    biliVariant: BiliVariant;
    biliVersion: number;
    segments: number[][];
}

export interface Argument {
    displayUpList: 'auto' | 'show' | 'hide';
    purifyComment: boolean | number;
    sponsorBlock: boolean | string;
}

export type Middleware = CoreMiddleware<State, Argument>;

export const setupArgument: Middleware = setupArgumentFactory<Argument>({
    displayUpList: 'show',
    purifyComment: true,
    sponsorBlock: true,
});

export const parseUserAgent: Middleware = (ctx, next) => {
    ctx.state.biliVariant = BiliVariant.UNIVERSAL;
    ctx.state.biliVersion = 0;

    const ua = ctx.request.headers['user-agent'] || ctx.request.headers['User-Agent'] || '';
    const match = ua.match(/bili-(?<variant>[^/]+)\/(?<version>\d+)/);
    if (match?.groups) {
        ctx.state.biliVariant = match.groups.variant as BiliVariant;
        ctx.state.biliVersion = Number(match.groups.version);
    }

    return next();
};

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
