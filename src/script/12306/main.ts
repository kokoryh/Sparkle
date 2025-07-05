import { $, createHandler } from './handler';

try {
    createHandler($.request.url)?.done();
} catch (e) {
    $.info(e);
} finally {
    $.exit();
}
