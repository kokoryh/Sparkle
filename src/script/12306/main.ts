import { $ } from '@core/env';
import { createHandler } from './handler';

try {
    createHandler($.request.url)?.done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
