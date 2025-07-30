import { $ } from '@core/env';
import { BilibiliWebpageHandler } from './handler';

try {
    new BilibiliWebpageHandler().done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
