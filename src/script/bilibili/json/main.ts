import { $ } from '@core/env';
import { createHandler } from './factory';

try {
    createHandler($.url.pathname)?.process().done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
