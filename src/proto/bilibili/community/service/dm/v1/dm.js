// @generated by protobuf-ts 2.9.4 with parameter output_javascript_es2019
// @generated from protobuf file "bilibili/community/service/dm/v1/dm.proto" (package "bilibili.community.service.dm.v1", syntax proto3)
// tslint:disable
import { WireType } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
// @generated message type with reflection information, may provide speed optimized methods
class DmViewReply$Type extends MessageType {
    constructor() {
        super("bilibili.community.service.dm.v1.DmViewReply", [
            { no: 18, name: "activity_meta", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 22, name: "command", kind: "message", T: () => Command }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.activityMeta = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target !== null && target !== void 0 ? target : this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated string activity_meta */ 18:
                    message.activityMeta.push(reader.string());
                    break;
                case /* bilibili.community.service.dm.v1.Command command */ 22:
                    message.command = Command.internalBinaryRead(reader, reader.uint32(), options, message.command);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated string activity_meta = 18; */
        for (let i = 0; i < message.activityMeta.length; i++)
            writer.tag(18, WireType.LengthDelimited).string(message.activityMeta[i]);
        /* bilibili.community.service.dm.v1.Command command = 22; */
        if (message.command)
            Command.internalBinaryWrite(message.command, writer.tag(22, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.community.service.dm.v1.DmViewReply
 */
export const DmViewReply = new DmViewReply$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Command$Type extends MessageType {
    constructor() {
        super("bilibili.community.service.dm.v1.Command", [
            { no: 1, name: "commandDms", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.commandDms = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target !== null && target !== void 0 ? target : this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated bytes commandDms */ 1:
                    message.commandDms.push(reader.bytes());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated bytes commandDms = 1; */
        for (let i = 0; i < message.commandDms.length; i++)
            writer.tag(1, WireType.LengthDelimited).bytes(message.commandDms[i]);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.community.service.dm.v1.Command
 */
export const Command = new Command$Type();
