import { Middleware } from './middleware';

export class Layer {
    path: string | RegExp;
    methods: string[];
    stack: Middleware[];

    constructor(path: string | RegExp, methods: string[], middleware: Middleware[]) {
        this.path = path;
        this.methods = methods;
        this.stack = middleware;
    }
}
