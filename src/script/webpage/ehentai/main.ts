import { Application } from '@core/application';
import { doneResponse, parseHTMLResponse } from '@core/middleware';
import { handleHTMLMessage, Middleware } from '../handler';

const setHTMLState: Middleware = (ctx, next) => {
    ctx.state.injectScript = '{{ @template/script.js }}';
    return next();
};

new Application().use(doneResponse).use(parseHTMLResponse).use(setHTMLState).use(handleHTMLMessage).run();
