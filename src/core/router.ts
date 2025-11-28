import { compose } from './compose';
import { Context } from './context';
import { Layer } from './layer';
import { Middleware } from './middleware';

type Path = string | RegExp;

type PathMatcher = (layer: Layer, ctx: Context) => boolean;

interface Options {
    matchPath?: PathMatcher;
}

export const matchExactPath: PathMatcher = (layer, ctx) => ctx.path === layer.path;

export const matchUrlSuffix: PathMatcher = (layer, ctx) => ctx.request.url.endsWith(layer.path as string);

export const matchPathSuffix: PathMatcher = (layer, ctx) => ctx.path.endsWith(layer.path as string);

export class Router {
    private stack: Layer[] = [];

    private matchPath: PathMatcher;

    constructor(opts: Options = {}) {
        this.matchPath = opts.matchPath || matchExactPath;
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
