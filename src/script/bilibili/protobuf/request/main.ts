import { $ } from '../env';
import { createHandler } from './factory';

(async () => {
    await createHandler($.request.url)?.done();
})()
    .catch(e => {
        $.error(e, $.request.url);
    })
    .finally(() => {
        $.exit();
    });
