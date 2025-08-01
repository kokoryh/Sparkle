import { $ } from '@core/env';
import { MissavHandler } from './handler';

try {
    new MissavHandler().process().done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
