import { $ } from '@core/env';
import { createHandler } from './factory';

(async () => {
    (await createHandler($.request.url)?.process())?.done();
})()
    .catch(e => {
        $.error(e, $.request.url);
    })
    .finally(() => {
        $.exit();
    });
