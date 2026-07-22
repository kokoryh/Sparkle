import { Application } from '@core/application';
import { doneResponse, parseGRPCResponse } from '@core/middleware';
import { handleError, handleResponseHeaders } from '../middleware';
import { router } from './router';

const app = new Application();

app.use(doneResponse)
    .use(handleResponseHeaders)
    .use(handleError)
    .use(parseGRPCResponse)
    .use(router.routes())
    .use(router.routeNotMatched());

export { app };
