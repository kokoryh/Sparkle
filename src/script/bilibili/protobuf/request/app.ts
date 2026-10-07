import { Application } from '@core/application';
import { doneFakeResponse } from '@core/middleware';
import { fixResponseHeaders, initArgument } from '../middleware';
import { router } from './router';

const app = new Application();

app.use(doneFakeResponse).use(fixResponseHeaders).use(initArgument).use(router.routes()).use(router.routeNotMatched());

export { app };
