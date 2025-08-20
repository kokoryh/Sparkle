import { ElementFilter, HtmlMessage } from '@core/message';

export class HanimeHandler extends HtmlMessage {
    protected styleTemplate = '{{ @template/style.css }}';

    protected filterList: ElementFilter[] = [
        {
            selector: 'script',
            filterFn: (element: HTMLScriptElement) => {
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
            filterFn: (element: HTMLIFrameElement) => {
                const src = element.src || '';
                return /creative.*\/widgets\/v4\/Universal\?/.test(src);
            },
        },
    ];
}
