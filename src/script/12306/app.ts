import { Application } from '@core/application';
import router from './router';

const app = new Application();

app.use(router.routes());

export default app;
