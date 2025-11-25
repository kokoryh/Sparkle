import { initArgument, Middleware } from '@core/middleware';
import { getI18n } from '../locale';

export interface Argument {
    showCreatorHub: boolean | number;
}

export const withArgument = initArgument({ showCreatorHub: false } as Argument);

export const withI18n: Middleware = async (ctx, next) => {
    const locale = ctx.url.searchParams.get('s_locale') || '';
    ctx.state.i18n = (await getI18n(locale)()).default;
    return next();
};

export const interceptor: Middleware = (ctx, next) => {
    if (ctx.state.message.code !== 0) ctx.exit();
    return next();
};
