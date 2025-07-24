import Client from '@core/client';
import { MissavHandler } from './handler';

const $ = Client.getInstance('Missav');

try {
    new MissavHandler($).done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
