import { $, createHandler } from './handler';

try {
    createHandler($.request.url)?.done();
} catch (e) {
    $.error(e);
} finally {
    $.exit();
}
