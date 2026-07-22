import { Application } from '@core/application';
import { doneFakeResponse } from '@core/middleware';
import { handleError, handleResponseHeaders, initArgument } from '../middleware';
import { router } from './router';

const app = new Application();

app.use(doneFakeResponse)
    .use(handleResponseHeaders)
    .use(handleError)
    .use(initArgument)
    .use(router.routes())
    .use(router.routeNotMatched());

export { app };
