import { ctx } from './context';

export class ExitError extends Error {
    readonly name = 'Exit';

    constructor(
        readonly code: number,
        message = `Process exited with code ${code}`
    ) {
        super(message);
    }

    toString(): string {
        return `[${this.name}] ${this.message}`;
    }
}

export function exit(code = 0): never {
    throw new ExitError(code);
}

export function abort(): never {
    ctx.abort();
    throw new ExitError(0);
}
