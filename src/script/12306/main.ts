import { $, createHandler } from './handler';

try {
    createHandler($.request.url)?.done();
} catch (e) {
    $.log(e);
} finally {
    $.exit();
}
