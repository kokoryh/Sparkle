import { HTMLState, Middleware } from '../handler';

export const setHTMLState: Middleware = (ctx, next) => {
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
