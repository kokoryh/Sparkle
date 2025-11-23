import { compose } from './compose';
import { Context } from './context';
import { Layer } from './layer';
import { Middleware } from './middleware';

type Path = string | RegExp;

interface Options {
    matchPath?: (layer: Layer, ctx: Context) => boolean;
}

export class Router {
    private stack: Layer[] = [];

    private matchPath: (layer: Layer, ctx: Context) => boolean;

    constructor(opts: Options = {}) {
        this.matchPath = opts.matchPath || ((layer, ctx) => layer.path === ctx.path);
    }

    use(...middleware: Middleware[]): this {
        return this.register('', middleware);
    }

    add(path: Path | Path[], ...middleware: Middleware[]): this {
        return this.register(path, middleware);
    }

    routes(): Middleware {
        return (ctx, next) => {
            const matched = this.match(ctx);

            if (matched.length === 0) return next();

            const layerChain = matched.flatMap(layer => layer.stack);

            return compose(layerChain)(ctx, next);
        };
    }

    private match(ctx: Context): Layer[] {
        return this.stack.filter(layer => layer.path === '' || this.matchPath(layer, ctx));
    }

    private register(path: Path | Path[], middleware: Middleware[]): this {
        if (Array.isArray(path)) {
            for (const p of path) {
                this.stack.push(new Layer(p, middleware));
            }
        } else {
            this.stack.push(new Layer(path, middleware));
        }
        return this;
    }
}
