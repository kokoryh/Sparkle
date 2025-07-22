import { $, MissavHandler } from './handler';

try {
    new MissavHandler($.response.body as string).done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
