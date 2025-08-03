import { $ } from '@core/env';
import { EHentaiHandler } from './handler';

try {
    new EHentaiHandler().process().done();
} catch (e) {
    $.error(e, $.request.url);
} finally {
    $.exit();
}
