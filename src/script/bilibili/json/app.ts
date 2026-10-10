import { Application } from '@core/application';
import { doneResponse, transformJsonResponse } from '@core/middleware';
import { assertBiliStatusCode } from './middleware';
import { router } from './router';

const app = new Application();

app.use(doneResponse).use(assertBiliStatusCode).use(transformJsonResponse).use(router.routes()).use(router.notFound());

export { app };
