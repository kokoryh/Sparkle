import { MessageType } from '@protobuf-ts/runtime';
import Client from '@core/client';
import { ProtobufMessage } from '@core/message';
import { ProtobufOptions } from '@entity/bilibili';
import { createCaseInsensitiveDictionary } from '@utils/index';

export const $ = Client.getInstance('Bilibili Protobuf');

export abstract class BilibiliProtobufHandler<T extends object> extends ProtobufMessage<T> {
    protected options: ProtobufOptions = {
        showUpList: 'auto',
        filterTopReplies: true,
        airborne: true,
    };

    constructor(type: MessageType<T>, body: Uint8Array) {
        super(type, body);
        Object.assign(this.options, $.argument);
    }

    protected abstract process(): void;

    abstract done(): void;

    protected isHD(): boolean {
        const headers = createCaseInsensitiveDictionary($.request.headers);
        return headers?.['user-agent']?.includes('bili-hd');
    }

    protected fromRawBody(rawBody: Uint8Array): Uint8Array {
        const header = rawBody.slice(0, 5);
        let body = rawBody.slice(5);
        if (header[0]) {
            body = $.ungzip(body) as Uint8Array<ArrayBuffer>;
        }
        return body;
    }

    protected toRawBody(body: Uint8Array): Uint8Array {
        const checksum = this.checkSum(body.length);
        const rawBody = new Uint8Array(5 + body.length);
        rawBody[0] = 0; // 置protobuf为未压缩状态
        rawBody.set(checksum, 1); // 1-4位：校验值
        rawBody.set(body, 5); // 5-end位：protobuf数据
        return rawBody;
    }

    private checkSum(num: number): Uint8Array {
        const arr = new ArrayBuffer(4);
        const view = new DataView(arr);
        view.setUint32(0, num, false);
        return new Uint8Array(arr);
    }
}
