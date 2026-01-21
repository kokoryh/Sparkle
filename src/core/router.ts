import { compose } from './compose';
import { Context } from './context';
import { Layer } from './layer';
import { Middleware } from './middleware';

type Path = string | RegExp;

type PathMatcher = (layer: Layer, ctx: Context) => boolean;

interface Options {
    matchPath?: PathMatcher;
}

interface Matched {
    path: Layer[];
    pathAndMethod: Layer[];
    route: boolean;
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
        return this.register('', [], middleware);
    }

    get(path: Path | Path[], ...middleware: Middleware[]): this {
        return this.register(path, ['GET'], middleware);
    }

    post(path: Path | Path[], ...middleware: Middleware[]): this {
        return this.register(path, ['POST'], middleware);
    }

    routes(): Middleware {
        return (ctx, next) => {
            const matched = this.match(ctx);

            if (!matched.route) return next();

            ctx.state.route = true;

            const layerChain = matched.pathAndMethod.flatMap(layer => layer.stack);

            return compose(layerChain)(ctx, next);
        };
    }

    private match(ctx: Context): Matched {
        const matched: Matched = {
            path: [],
            pathAndMethod: [],
            route: false,
        };

        for (const layer of this.stack) {
            if (layer.path === '' || this.matchPath(layer, ctx)) {
                matched.path.push(layer);

                if (layer.methods.length === 0 || layer.methods.includes(ctx.method)) {
                    matched.pathAndMethod.push(layer);

                    if (layer.methods.length > 0) {
                        matched.route = true;
                    }
                }
            }
        }

        return matched;
    }

    private register(path: Path | Path[], methods: string[], middleware: Middleware[]): this {
        if (Array.isArray(path)) {
            for (const singlePath of path) {
                this.stack.push(new Layer(singlePath, methods, middleware));
            }
        } else {
            this.stack.push(new Layer(path, methods, middleware));
        }
        return this;
    }
}
