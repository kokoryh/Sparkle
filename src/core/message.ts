import { MessageType } from '@protobuf-ts/runtime';
import { parse, stringify } from 'lossless-json';
import Client from './client';
import { createCaseInsensitiveDictionary } from '@utils/index';

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

export abstract class LosslessJsonMessage<T extends object> extends JsonMessage<T> {
    protected fromJsonString(data: string): T {
        return parse(data) as T;
    }

    protected toJsonString(): string {
        return stringify(this.message) as string;
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
    protected $: Client;

    protected message: Document;

    protected domParser = new DOMParser();

    protected styleTemplate?: string;

    protected scriptTemplate?: string;

    protected scriptFilter?: (element: HTMLScriptElement) => boolean;

    constructor($: Client) {
        const headers = createCaseInsensitiveDictionary($.response.headers);
        if (!headers['content-type']?.includes('text/html')) {
            throw new Error('Invalid URL');
        }
        this.$ = $;
        this.message = this.fromString($.response.body as string);
    }

    done(): void {
        this.process();
        this.$.done({ body: this.toString() });
    }

    protected process(): void {
        if (this.scriptFilter) {
            this.remove(this.query('script').filter(this.scriptFilter));
        }
        if (this.scriptTemplate) {
            const scriptElement = this.message.createElement('script');
            scriptElement.textContent = this.scriptTemplate;
            this.append(this.message.head, scriptElement);
        }
        if (this.styleTemplate) {
            const styleElement = this.message.createElement('style');
            styleElement.textContent = this.styleTemplate;
            this.append(this.message.head, styleElement);
        }
    }

    protected fromString(data: string): Document {
        return this.domParser.parseFromString(data, 'text/html');
    }

    protected toString(): string {
        return `<!DOCTYPE HTML>${this.message.documentElement.outerHTML}`;
    }

    protected query<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K][] {
        return Array.from(this.message.querySelectorAll(selector));
    }

    protected append(node: Node, ...childNodes: ChildNode[]): Node[] {
        return childNodes.map(childNode => node.appendChild(childNode));
    }

    protected remove(nodes: Node[]): (Node | undefined)[] {
        return nodes.map(node => node.parentElement?.removeChild(node));
    }
}
