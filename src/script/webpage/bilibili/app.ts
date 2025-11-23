import { Application } from '@core/application';
import { doneResponse, parseHtmlResponse } from '@core/middleware';

const app = new Application();

app.use(doneResponse)
    .use(parseHtmlResponse)
    .use((ctx, next) => {
        ctx.state.scriptTemplate = '{{ @template/script.ts }}';
        return next();
    })
    .use();

export default app;
