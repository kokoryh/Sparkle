import { Application } from '@core/application';
import { doneResponse, parseJsonResponse, routeNotMatched } from '@core/middleware';
import router from './router';

const app = new Application();

app.use(doneResponse).use(parseJsonResponse).use(router.routes()).use(routeNotMatched);

export default app;
