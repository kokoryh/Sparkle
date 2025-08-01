import { $ } from '@core/env';
import { HanimeHandler } from './handler';

try {
    new HanimeHandler().process().done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
