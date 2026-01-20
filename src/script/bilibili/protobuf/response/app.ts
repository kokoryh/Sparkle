import { Application } from '@core/application';
import { doneResponse, parseGrpcResponse, routeNotMatched } from '@core/middleware';
import { setResponseHeaders } from '../middleware';
import router from './router';

const app = new Application();

app.use(doneResponse).use(setResponseHeaders).use(parseGrpcResponse).use(router.routes()).use(routeNotMatched);

export default app;
