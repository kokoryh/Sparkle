import { Application } from '@core/application';
import router from './router';

const app = new Application();

app.use(router.routes()).use(router.routeNotMatched());

export default app;
