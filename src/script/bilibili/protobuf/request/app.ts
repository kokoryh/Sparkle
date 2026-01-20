import { Application } from '@core/application';
import { doneFakeResponse, routeNotMatched } from '@core/middleware';
import { initArgument, setResponseHeaders } from '../middleware';
import router from './router';

const app = new Application();

app.use(doneFakeResponse).use(setResponseHeaders).use(initArgument).use(router.routes()).use(routeNotMatched);

export default app;
