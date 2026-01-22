import { Application } from '@core/application';
import { doneResponse, parseGrpcResponse } from '@core/middleware';
import { initArgument, handleResponseHeaders } from '../middleware';
import router from './router';

const app = new Application();

app.use(doneResponse)
    .use(initArgument)
    .use(handleResponseHeaders)
    .use(parseGrpcResponse)
    .use(router.routes())
    .use(router.routeNotMatched());

export default app;
