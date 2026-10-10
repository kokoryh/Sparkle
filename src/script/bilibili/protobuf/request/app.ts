import { Application } from '@core/application';
import { doneFakeResponse } from '@core/middleware';
import { fixResponseHeaders, setupArgument } from '../middleware';
import { router } from './router';

const app = new Application();

app.use(doneFakeResponse).use(fixResponseHeaders).use(setupArgument).use(router.routes()).use(router.notFound());

export { app };
