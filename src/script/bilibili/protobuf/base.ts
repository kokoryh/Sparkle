import { MessageType } from '@protobuf-ts/runtime';
import { $ } from '@core/env';
import { ProtobufMessage } from '@core/message';

export abstract class BilibiliProtobufHandler<T extends object> extends ProtobufMessage<T> {
    constructor(type: MessageType<T>, body: Uint8Array) {
        super(type, body);
    }

    abstract done(): void;

    abstract process(): this | Promise<this>;

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
