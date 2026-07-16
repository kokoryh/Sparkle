import { Application } from '@core/application';
import { doneResponse, parseHTMLResponse } from '@core/middleware';
import { HTMLState } from '@/types/context';
import { handleHTMLMessage, Middleware } from '../handler';

const setHTMLState: Middleware = (ctx, next) => {
    const state = ctx.state;

    state.injectScript = '{{ @template/script.js }}';

    state.injectStyle = '{{ @template/style.css }}';

    state.nodeFilters = [
        {
            selector: 'script',
            predicate: (element: HTMLScriptElement) => {
                const src = element.src || '';
                const innerText = element.innerText || '';
                return (
                    src.includes('tsyndicate.com') ||
                    innerText.includes('TSOutstreamVideo') ||
                    innerText.includes('htmlAds')
                );
            },
        },
    ] as HTMLState['nodeFilters'];

    return next();
};

new Application().use(doneResponse).use(parseHTMLResponse).use(setHTMLState).use(handleHTMLMessage).run();
