import { $ } from './handler';
import { createHandler } from './factory';

try {
    createHandler($.url.pathname)?.done();
} catch (e) {
    $.info(e);
} finally {
    $.exit();
}
