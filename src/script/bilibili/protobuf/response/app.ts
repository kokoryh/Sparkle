import { Application } from '@core/application';
import { doneResponse, parseGrpcResponse } from '@core/middleware';
import router from './router';

const app = new Application();

app.use(doneResponse).use(parseGrpcResponse).use(router.routes());

export default app;
