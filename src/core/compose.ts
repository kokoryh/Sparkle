import { Context } from './context';
import { Middleware, Next } from './middleware';

export const compose = (middleware: Middleware[]) => async (ctx: Context, next?: Next) => {
    const dispatch = (i: number) => async () => {
        const fn = i === middleware.length ? next : middleware[i];
        if (!fn) return;
        return await fn(ctx, dispatch(i + 1));
    };
    return dispatch(0)();
};
