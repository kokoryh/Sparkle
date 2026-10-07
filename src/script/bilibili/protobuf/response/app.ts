import { Application } from '@core/application';
import { doneResponse, parseGRPCResponse } from '@core/middleware';
import { fixResponseHeaders } from '../middleware';
import { router } from './router';

const app = new Application();

app.use(doneResponse).use(fixResponseHeaders).use(parseGRPCResponse).use(router.routes()).use(router.routeNotMatched());

export { app };
