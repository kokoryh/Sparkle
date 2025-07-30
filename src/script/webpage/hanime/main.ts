import { $ } from '@core/env';
import { HanimeHandler } from './handler';

try {
    new HanimeHandler().done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
