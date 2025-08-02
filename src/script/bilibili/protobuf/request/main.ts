import { $ } from '@core/env';
import { DmSegMobileReqHandler } from './handler';

(async () => {
    (await new DmSegMobileReqHandler().process()).done();
})()
    .catch(e => {
        $.error(e, $.request.url);
    })
    .finally(() => {
        $.exit();
    });
