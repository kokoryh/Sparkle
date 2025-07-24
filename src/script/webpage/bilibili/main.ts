import Client from '@core/client';
import { BilibiliHtmlHandler } from './handler';

const $ = Client.getInstance('Bilibili HTML');

try {
    new BilibiliHtmlHandler($).done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
