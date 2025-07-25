import { HtmlMessage } from '@core/message';

export class BilibiliHtmlHandler extends HtmlMessage {
    protected scriptTemplate = '{{ @template/script.ts }}';
}
