import { Application } from '@core/application';
import { routeNotMatched } from '@core/middleware';
import router from './router';

const app = new Application();

app.use(router.routes()).use(routeNotMatched);

export default app;
