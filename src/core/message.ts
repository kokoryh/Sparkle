import { MessageType } from '@protobuf-ts/runtime';

export abstract class AbstractMessage {
    abstract done(): void | Promise<void>;
}

export abstract class JsonMessage<T extends object> extends AbstractMessage {
    message: T;

    constructor(data: string) {
        super();
        this.message = this.fromJsonString(data);
    }

    protected fromJsonString(data: string): T {
        return JSON.parse(data);
    }

    protected toJsonString(): string {
        return JSON.stringify(this.message);
    }
}

export abstract class ProtobufMessage<T extends object> extends AbstractMessage {
    type: MessageType<T>;

    message: T;

    constructor(type: MessageType<T>, body: Uint8Array) {
        super();
        this.type = type;
        this.message = this.fromBinary(this.fromRawBody(body));
    }

    protected fromBinary(data: Uint8Array): T {
        return this.type.fromBinary(data);
    }

    protected toBinary(): Uint8Array {
        return this.type.toBinary(this.message);
    }

    protected fromRawBody(body: Uint8Array): Uint8Array {
        return body;
    }

    protected toRawBody(body: Uint8Array): Uint8Array {
        return body;
    }
}
