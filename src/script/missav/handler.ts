import Client from '@core/client';
import { HtmlMessage } from '@core/message';

export const $ = Client.getInstance('Missav');

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

    done(): void {
        this.process();
        $.done({ body: this.toString() });
    }

    protected process(): void {
        this.removeElement();
        this.addElement();
    }

    private removeElement(): void {
        const scriptElements = this.message.getElementsByTagName('script');
        this.remove(...Array.from(scriptElements).filter(this.scriptElementFilter));
    }

    private addElement(): void {
        const scriptElement = this.message.createElement('script');
        scriptElement.textContent = `(function(){'use strict';document.addEventListener('ready',()=>{window.open=()=>{};if(window.player?.pause){const pause=window.player.pause;window.player.pause=()=>{if(document.hasFocus()){pause()}}}})})();`;

        const styleElement = this.message.createElement('style');
        styleElement.textContent = `.lg\\:block,.lg\\:hidden,a[href*="//bit.ly/"],div[x-init*="#genki-counter'"],div:has(a[href*='go.myavlive.com']),[x-show$="video_details'"]>div>ul,div[style*='width: 300px; height: 250px;'],.relative>div[x-init*='campaignId=under_player'],div[x-show^='recommendItems']~div[class]:has(>div>div.mx-auto>div.flex>a[rel^='sponsored']){display:none!important}`;

        this.append(this.message.head, scriptElement, styleElement);
    }
}
