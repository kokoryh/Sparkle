import { createCaseInsensitiveDictionary } from '@utils/index';
import { $, MissavHandler } from './handler';

try {
    const headers = createCaseInsensitiveDictionary($.response.headers);
    if (!headers['content-type']?.includes('text/html')) {
        throw new Error('Invalid URL');
    }
    new MissavHandler($.response.body as string).done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
