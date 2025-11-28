import { Application } from '@core/application';
import { doneFakeResponse } from '@core/middleware';
import { withArgument } from '../middleware';
import router from './router';

const app = new Application();

app.use(doneFakeResponse).use(withArgument).use(router.routes());

export default app;
