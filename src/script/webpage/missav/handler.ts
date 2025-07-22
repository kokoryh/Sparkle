import Client from '@core/client';
import { HtmlMessage } from '@core/message';
import { createCaseInsensitiveDictionary } from '@utils/index';

export const $ = Client.getInstance('missav');

export class MissavHandler extends HtmlMessage {
    private scriptElementFilter = (element: HTMLScriptElement) => {
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

    constructor(data: string) {
        const headers = createCaseInsensitiveDictionary($.response.headers);
        if (!headers['content-type']?.includes('text/html')) {
            throw new Error('Invalid URL');
        }
        super(data);
    }

    done(): void {
        this.process();
        $.done({ body: this.toString() });
    }

    protected process(): void {
        this.removeElement();
        this.addElement();
    }

    private removeElement(): void {
        this.remove(this.query('script').filter(this.scriptElementFilter));
    }

    private addElement(): void {
        const scriptElement = this.message.createElement('script');
        scriptElement.textContent = '{{ @template/script.js }}';

        const styleElement = this.message.createElement('style');
        styleElement.textContent = '{{ @template/style.css }}';

        this.append(this.message.head, scriptElement, styleElement);
    }
}
