import { $ } from './env';
import { createHandler } from './factory';

try {
    createHandler($.url.pathname)?.done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
