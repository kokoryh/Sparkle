import { Middleware } from '../handler';

export const setHTMLState: Middleware = (ctx, next) => {
    ctx.state.injectScript = '{{ @template/script.js }}';
    return next();
};
