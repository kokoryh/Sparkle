import { Application } from '@core/application';
import { doneResponse, parseJsonResponse } from '@core/middleware';
import { router } from './router';

const app = new Application();

app.use(doneResponse).use(parseJsonResponse).use(router.routes()).use(router.routeNotMatched());

export { app };
