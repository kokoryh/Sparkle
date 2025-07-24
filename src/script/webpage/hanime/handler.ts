import { HtmlMessage } from '@core/message';

export class HanimeHandler extends HtmlMessage {
    protected styleTemplate = '{{ @template/style.css }}';

    protected scriptFilter = (element: HTMLScriptElement) => {
        const innerText = element.innerText || '';
        if (element.getAttribute('src')?.includes('googlesyndication.com/pagead/')) {
            return true;
        }
        if (innerText.includes('/infinity.js.aspx?')) {
            return true;
        }
        return false;
    };
}
