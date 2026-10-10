import { Application } from '@core/application';
import { doneResponse, transformGrpcResponse } from '@core/middleware';
import { fixResponseHeaders } from '../middleware';
import { router } from './router';

const app = new Application();

app.use(doneResponse).use(fixResponseHeaders).use(transformGrpcResponse).use(router.routes()).use(router.notFound());

export { app };
