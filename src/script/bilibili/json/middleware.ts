import { createInitArgumentMiddleware, Middleware as DefaultMiddleware } from '@core/middleware';
import { exit } from '@core/process';
import { getI18n, I18n } from '../locale';

export interface Argument {
    showCreatorHub: boolean | number;
}

export interface State<T> {
    message: T;
    i18n: I18n;
}

export type Middleware<T = { code: number }> = DefaultMiddleware<State<T>, Argument>;

export const initArgument = createInitArgumentMiddleware<Argument>({ showCreatorHub: false });

export const initI18n: Middleware = async (ctx, next) => {
    const locale = ctx.url.searchParams.get('s_locale') || '';
    ctx.state.i18n = (await getI18n(locale)()).default;
    return next();
};

export const interceptor: Middleware = (ctx, next) => {
    if (ctx.state.message.code !== 0) exit();
    return next();
};
