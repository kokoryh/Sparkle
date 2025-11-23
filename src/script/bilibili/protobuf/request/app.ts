import { Application } from '@core/application';
import { doneFakeResponse } from '@core/middleware';
import router from './router';

const app = new Application();

app.use(doneFakeResponse).use(router.routes());

export default app;
