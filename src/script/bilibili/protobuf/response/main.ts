import { $ } from '../base';
import { createHandler } from './factory';

try {
    createHandler($.request.url)?.done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
