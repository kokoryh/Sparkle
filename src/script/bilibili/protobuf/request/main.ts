import { $ } from '@core/env';
import { createHandler } from './factory';
import { DmSegMobileReqHandler } from './handler';

(async () => {
    (await new DmSegMobileReqHandler().process()).done();
    // (await createHandler($.request.url)?.process())?.done();
})()
    .catch(e => {
        $.error(e, $.request.url);
    })
    .finally(() => {
        $.exit();
    });
