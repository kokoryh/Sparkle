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
        const ctx = Context.createInstance();
        compose(this.middleware)(ctx)
            .catch(err => ctx.onerror(err))
            .finally(() => ctx.exit());
    }
}
