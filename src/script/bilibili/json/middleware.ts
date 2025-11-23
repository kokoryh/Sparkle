import { createArgument, Middleware } from '@core/middleware';
import { getI18n } from '../locale';

export const interceptor: Middleware = (ctx, next) => {
    if (ctx.state.message.code !== 0) ctx.exit();
    return next();
};

export interface Argument {
    showCreatorHub: boolean | number;
}

export const withArgument = createArgument({ showCreatorHub: false } as Argument);

export const withI18n: Middleware = async (ctx, next) => {
    const locale = ctx.url.searchParams.get('s_locale') || '';
    ctx.state.i18n = (await getI18n(locale)()).default;
    return next();
};
