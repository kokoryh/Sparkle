import { Application } from '@core/application';
import { doneFakeResponse, routeNotMatched } from '@core/middleware';
import { handleResponseHeaders, initArgument } from '../middleware';
import router from './router';

const app = new Application();

app.use(doneFakeResponse).use(initArgument).use(handleResponseHeaders).use(router.routes()).use(routeNotMatched);

export default app;
