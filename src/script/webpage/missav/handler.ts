import { ElementFilter, HtmlMessage } from '@core/message';

export class MissavHandler extends HtmlMessage {
    protected styleTemplate = '{{ @template/style.css }}';

    protected scriptTemplate = '{{ @template/script.js }}';

    protected filterList: ElementFilter[] = [
        {
            selector: 'script',
            filterFn: (element: HTMLScriptElement) => {
                const src = element.src || '';
                const innerText = element.innerText || '';
                return (
                    src.includes('tsyndicate.com') ||
                    innerText.includes('TSOutstreamVideo') ||
                    innerText.includes('htmlAds')
                );
            },
        },
    ];
}
