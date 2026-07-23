import { HTMLState, Middleware } from '../handler';

export const setHTMLState: Middleware = (ctx, next) => {
    const state = ctx.state;

    state.injectStyle = '{{ @template/style.css }}';

    state.nodeFilters = [
        {
            selector: 'script',
            predicate: (element: HTMLScriptElement) => {
                const src = element.src || '';
                const innerText = element.innerText || '';
                return (
                    src.includes('googlesyndication.com/pagead/') ||
                    innerText.includes('/infinity.js.aspx?') ||
                    /creative.*\/widgets\/v4\/Universal\?/.test(innerText)
                );
            },
        },
        {
            selector: 'iframe',
            predicate: (element: HTMLIFrameElement) => {
                const src = element.src || '';
                return /creative.*\/widgets\/v4\/Universal\?/.test(src);
            },
        },
    ] as HTMLState['nodeFilters'];

    return next();
};
