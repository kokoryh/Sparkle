import { MessageType } from '@protobuf-ts/runtime';

export interface IMessage {
    done: () => void | Promise<void>;
}

export abstract class JsonMessage<T extends object> implements IMessage {
    protected message: T;

    constructor(data: string) {
        this.message = this.fromJsonString(data);
    }

    abstract done(): void | Promise<void>;

    protected fromJsonString(data: string): T {
        return JSON.parse(data);
    }

    protected toJsonString(): string {
        return JSON.stringify(this.message);
    }
}

export abstract class ProtobufMessage<T extends object> implements IMessage {
    protected type: MessageType<T>;

    protected message: T;

    constructor(type: MessageType<T>, data: Uint8Array) {
        this.type = type;
        this.message = this.fromBinary(data);
    }

    abstract done(): void | Promise<void>;

    protected fromBinary(data: Uint8Array): T {
        return this.type.fromBinary(data);
    }

    protected toBinary(): Uint8Array {
        return this.type.toBinary(this.message);
    }
}

export abstract class HtmlMessage implements IMessage {
    protected message: Document;

    protected domParser = new DOMParser();

    constructor(data: string) {
        this.message = this.fromString(data);
    }

    abstract done(): void | Promise<void>;

    protected fromString(data: string): Document {
        return this.domParser.parseFromString(data, 'text/html');
    }

    protected toString(): string {
        return this.message.documentElement.outerHTML;
    }
}
