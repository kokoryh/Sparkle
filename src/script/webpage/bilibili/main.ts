import { Application } from '@core/application';
import { doneResponse, transformHtmlResponse } from '@core/middleware';
import { applyHtmlModifications } from '../handler';
import { prepareHtmlState } from './middleware';

new Application().use(doneResponse).use(transformHtmlResponse).use(prepareHtmlState).use(applyHtmlModifications).run();
