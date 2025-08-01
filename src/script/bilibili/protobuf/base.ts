import { MessageType } from '@protobuf-ts/runtime';
import { $ } from '@core/env';
import { ProtobufMessage } from '@core/message';
import { ProtobufOptions } from '@entity/bilibili';
import { createCaseInsensitiveDictionary } from '@utils/index';

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

    abstract done(): void;

    abstract process(): this | Promise<this>;

    protected _processHeaders(headers: Record<string, string>): void {
        if (headers['grpc-encoding'] === 'gzip') {
            headers['grpc-encoding'] = 'identity';
        }
        if (headers['Grpc-Encoding'] === 'gzip') {
            headers['Grpc-Encoding'] = 'identity';
        }
    }

    protected override fromBinary(data: Uint8Array): T {
        const body = data[0] ? $.ungzip(data.subarray(5)) : data.subarray(5);
        return super.fromBinary(body);
    }

    protected override toBinary(): Uint8Array {
        const body = super.toBinary();
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
