import { Application } from '@core/application';
import { doneResponse, transformHtmlResponse } from '@core/middleware';
import { applyHtmlModifications, assertHtmlResponse } from '../middleware';
import { prepareHtmlState } from './middleware';

new Application()
    .use(doneResponse)
    .use(assertHtmlResponse)
    .use(transformHtmlResponse)
    .use(prepareHtmlState)
    .use(applyHtmlModifications)
    .run();
