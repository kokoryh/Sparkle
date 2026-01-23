import { Application } from '@core/application';
import { doneResponse, parseGrpcResponse } from '@core/middleware';
import { handleResponseHeaders } from '../middleware';
import router from './router';

const app = new Application();

app.use(doneResponse)
    .use(handleResponseHeaders)
    .use(parseGrpcResponse)
    .use(router.routes())
    .use(router.routeNotMatched());

export default app;
