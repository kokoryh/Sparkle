import { Application } from '@core/application';
import { doneResponse, parseHTMLResponse } from '@core/middleware';
import { handleHTMLMessage } from '../handler';
import { setHTMLState } from './middleware';

new Application().use(doneResponse).use(parseHTMLResponse).use(setHTMLState).use(handleHTMLMessage).run();
