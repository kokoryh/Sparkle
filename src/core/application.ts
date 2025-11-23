import { compose } from './compose';
import { Context } from './context';
import { Middleware } from './middleware';

export class Application {
    private middleware: Middleware[] = [];

    use(fn: Middleware): this {
        this.middleware.push(fn);
        return this;
    }

    run(): void {
        const ctx = Context.getInstance();
        compose(this.middleware)(ctx)
            .catch(e => ctx.error(e))
            .finally(() => ctx.exit());
    }
}
