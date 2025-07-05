import { MessageType } from '@protobuf-ts/runtime';

export abstract class AbstractHandler {
    abstract done(): void | Promise<void>;
}

export abstract class JsonHandler<T extends object> extends AbstractHandler {
    message: T;

    constructor(data: string) {
        super();
        this.message = this.fromJsonString(data);
    }

    fromJsonString(data: string): T {
        return JSON.parse(data);
    }

    toJsonString(): string {
        return JSON.stringify(this.message);
    }
}

export abstract class ProtobufHandler<T extends object> extends AbstractHandler {
    type: MessageType<T>;

    message: T;

    constructor(type: MessageType<T>, data: Uint8Array) {
        super();
        this.type = type;
        this.message = this.fromBinary(data);
    }

    fromBinary(data: Uint8Array): T {
        return this.type.fromBinary(data);
    }

    toBinary(): Uint8Array {
        return this.type.toBinary(this.message);
    }
}
