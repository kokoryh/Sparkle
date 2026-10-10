import { setupArgumentFactory, Middleware as CoreMiddleware } from '@core/middleware';
import { exit } from '@core/process';
import { I18n, loadI18n } from '../locale';

export interface Argument {
    showCreatorHub: boolean | number;
}

export interface State<T> {
    message: T;
    i18n: I18n;
}

export type Middleware<T = object> = CoreMiddleware<State<T>, Argument>;

export const setupArgument = setupArgumentFactory<Argument>({ showCreatorHub: false });

export const setupI18n: Middleware = async (ctx, next) => {
    const locale = ctx.url.searchParams.get('s_locale') || '';
    ctx.state.i18n = await loadI18n(locale);
    return next();
};

export const assertBiliStatusCode: Middleware = (ctx, next) => {
    if (ctx.response.headers['bili-status-code'] !== '0') exit();
    return next();
};
