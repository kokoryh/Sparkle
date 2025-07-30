import { HtmlMessage } from '@core/message';

export class BilibiliWebpageHandler extends HtmlMessage {
    protected scriptTemplate = '{{ @template/script.ts }}';
}
