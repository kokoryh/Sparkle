import { compose } from './compose';
import { ctx } from './context';
import { Logger } from './logger';
import { Middleware } from './middleware';

export class Application {
    private middleware: Middleware[] = [];

    use(fn: Middleware): this {
        this.middleware.push(fn);
        return this;
    }

    run(): void {
        compose(this.middleware)(ctx)
            .catch(e => Logger.error(e, ctx))
            .finally(() => ctx.exit());
    }
}
