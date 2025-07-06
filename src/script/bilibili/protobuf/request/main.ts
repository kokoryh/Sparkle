import { $ } from '../base';
import { createHandler } from './factory';

(async () => {
    await createHandler($.request.url)?.done();
})()
    .catch(e => {
        $.info(e);
    })
    .finally(() => {
        $.exit();
    });
