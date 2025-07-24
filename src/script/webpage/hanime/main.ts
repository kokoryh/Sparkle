import Client from '@core/client';
import { HanimeHandler } from './handler';

const $ = Client.getInstance('hanime');

try {
    new HanimeHandler($).done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
