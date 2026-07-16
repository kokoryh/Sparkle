import { Application } from '@core/application';
import { doneResponse, parseJSONResponse } from '@core/middleware';
import { router } from './router';

const app = new Application();

app.use(doneResponse).use(parseJSONResponse).use(router.routes()).use(router.routeNotMatched());

export { app };
