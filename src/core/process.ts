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

export class AbortError extends Error {
    readonly name = 'Abort';
}

export function exit(code = 0): never {
    throw new ExitError(code);
}

export function abort(): never {
    throw new AbortError();
}
