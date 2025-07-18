import { MessageType } from '@protobuf-ts/runtime';
import Client from '@core/client';
import { ProtobufMessage } from '@core/message';
import { ProtobufOptions } from '@entity/bilibili';
import { createCaseInsensitiveDictionary } from '@utils/index';

export const $ = Client.getInstance('Bilibili Protobuf');

export abstract class BilibiliProtobufHandler<T extends object> extends ProtobufMessage<T> {
    static getAppEdition(): 'universal' | 'hd' | 'inter' {
        const headers = createCaseInsensitiveDictionary($.request.headers);
        const ua = headers['user-agent'] || '';
        if (ua.startsWith('bili-hd')) {
            return 'hd';
        } else if (ua.startsWith('bili-inter')) {
            return 'inter';
        } else {
            return 'universal';
        }
    }

    protected options: ProtobufOptions = {
        showUpList: 'show',
        filterTopReplies: true,
        airborne: true,
    };

    constructor(type: MessageType<T>, body: Uint8Array) {
        super(type, body);
        Object.assign(this.options, $.argument);
        $.debug(this.options);
    }

    protected abstract process(): void;

    abstract done(): void;

    protected fromRawBody(body: Uint8Array): Uint8Array {
        return body[0] ? $.ungzip(body.subarray(5)) : body.subarray(5);
    }

    protected toRawBody(body: Uint8Array): Uint8Array {
        const length = body.length;
        const result = new Uint8Array(5 + length);
        result[0] = 0;
        result[1] = length >>> 24;
        result[2] = (length >>> 16) & 0xff;
        result[3] = (length >>> 8) & 0xff;
        result[4] = length & 0xff;
        result.set(body, 5);
        return result;
    }
}
