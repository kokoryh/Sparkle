import { HtmlMessage } from '@core/message';

export class MissavHandler extends HtmlMessage {
    protected styleTemplate = '{{ @template/style.css }}';

    protected scriptTemplate = '{{ @template/script.js }}';

    protected scriptFilter = (element: HTMLScriptElement) => {
        const innerText = element.innerText || '';
        if (element.getAttribute('src')?.includes('tsyndicate.com')) {
            return true;
        }
        if (innerText.includes('TSOutstreamVideo')) {
            return true;
        }
        if (innerText.includes('htmlAds')) {
            return true;
        }
        return false;
    };
}
