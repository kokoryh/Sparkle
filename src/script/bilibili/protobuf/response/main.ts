import { $ } from '@core/env';
import { createHandler } from './factory';

try {
    createHandler($.request.url)?.process().done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
