import { Application } from '@core/application';
import { doneResponse, Middleware, parseHTMLResponse } from '@core/middleware';
import { handleHTMLMessage, HTMLState } from '../handler';

const setHTMLState: Middleware = (ctx, next) => {
    const state = ctx.state as HTMLState;
    state.injectScript = '{{ @template/script.ts }}';
    return next();
};

new Application().use(doneResponse).use(parseHTMLResponse).use(setHTMLState).use(handleHTMLMessage).run();
