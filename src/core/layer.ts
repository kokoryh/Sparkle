import { Middleware } from './middleware';

export class Layer {
    path: string | RegExp;
    stack: Middleware[];

    constructor(path: string | RegExp, middleware: Middleware[]) {
        this.path = path;
        this.stack = middleware;
    }
}
