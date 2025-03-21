// @generated by protobuf-ts 2.9.4 with parameter output_javascript_es2019
// @generated from protobuf file "bilibili/playershared/playershared.proto" (package "bilibili.playershared", syntax proto3)
// tslint:disable
import { WireType } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
// @generated message type with reflection information, may provide speed optimized methods
class PlayArcConf$Type extends MessageType {
    constructor() {
        super("bilibili.playershared.PlayArcConf", [
            { no: 1, name: "arc_confs", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "message", T: () => ArcConf } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.arcConfs = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target !== null && target !== void 0 ? target : this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* map<int32, bilibili.playershared.ArcConf> arc_confs */ 1:
                    this.binaryReadMap1(message.arcConfs, reader, options);
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
    binaryReadMap1(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.int32();
                    break;
                case 2:
                    val = ArcConf.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.playershared.PlayArcConf.arc_confs");
            }
        }
        map[key !== null && key !== void 0 ? key : 0] = val !== null && val !== void 0 ? val : ArcConf.create();
    }
    internalBinaryWrite(message, writer, options) {
        /* map<int32, bilibili.playershared.ArcConf> arc_confs = 1; */
        for (let k of globalThis.Object.keys(message.arcConfs)) {
            writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.Varint).int32(parseInt(k));
            writer.tag(2, WireType.LengthDelimited).fork();
            ArcConf.internalBinaryWrite(message.arcConfs[k], writer, options);
            writer.join().join();
        }
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.playershared.PlayArcConf
 */
export const PlayArcConf = new PlayArcConf$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ArcConf$Type extends MessageType {
    constructor() {
        super("bilibili.playershared.ArcConf", [
            { no: 1, name: "is_support", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "disabled", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 3, name: "extra_content", kind: "message", T: () => ExtraContent },
            { no: 4, name: "unsupport_scene", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.isSupport = false;
        message.disabled = false;
        message.unsupportScene = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target !== null && target !== void 0 ? target : this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool is_support */ 1:
                    message.isSupport = reader.bool();
                    break;
                case /* bool disabled */ 2:
                    message.disabled = reader.bool();
                    break;
                case /* bilibili.playershared.ExtraContent extra_content */ 3:
                    message.extraContent = ExtraContent.internalBinaryRead(reader, reader.uint32(), options, message.extraContent);
                    break;
                case /* repeated int32 unsupport_scene */ 4:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.unsupportScene.push(reader.int32());
                    else
                        message.unsupportScene.push(reader.int32());
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
        /* bool is_support = 1; */
        if (message.isSupport !== false)
            writer.tag(1, WireType.Varint).bool(message.isSupport);
        /* bool disabled = 2; */
        if (message.disabled !== false)
            writer.tag(2, WireType.Varint).bool(message.disabled);
        /* bilibili.playershared.ExtraContent extra_content = 3; */
        if (message.extraContent)
            ExtraContent.internalBinaryWrite(message.extraContent, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* repeated int32 unsupport_scene = 4; */
        if (message.unsupportScene.length) {
            writer.tag(4, WireType.LengthDelimited).fork();
            for (let i = 0; i < message.unsupportScene.length; i++)
                writer.int32(message.unsupportScene[i]);
            writer.join();
        }
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.playershared.ArcConf
 */
export const ArcConf = new ArcConf$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ExtraContent$Type extends MessageType {
    constructor() {
        super("bilibili.playershared.ExtraContent", [
            { no: 1, name: "disable_reason", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "disable_code", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.disableReason = "";
        message.disableCode = 0n;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target !== null && target !== void 0 ? target : this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string disable_reason */ 1:
                    message.disableReason = reader.string();
                    break;
                case /* int64 disable_code */ 2:
                    message.disableCode = reader.int64().toBigInt();
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
        /* string disable_reason = 1; */
        if (message.disableReason !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.disableReason);
        /* int64 disable_code = 2; */
        if (message.disableCode !== 0n)
            writer.tag(2, WireType.Varint).int64(message.disableCode);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.playershared.ExtraContent
 */
export const ExtraContent = new ExtraContent$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ViewInfo$Type extends MessageType {
    constructor() {
        super("bilibili.playershared.ViewInfo", [
            { no: 2, name: "prompt_bar", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.promptBar = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target !== null && target !== void 0 ? target : this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bytes prompt_bar */ 2:
                    message.promptBar = reader.bytes();
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
        /* bytes prompt_bar = 2; */
        if (message.promptBar.length)
            writer.tag(2, WireType.LengthDelimited).bytes(message.promptBar);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.playershared.ViewInfo
 */
export const ViewInfo = new ViewInfo$Type();
