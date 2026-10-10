import { Middleware } from '../handler';

export const prepareHtmlState: Middleware = (ctx, next) => {
    ctx.state.injectScript = '{{ @template/script.ts }}';
    return next();
};
