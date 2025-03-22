// @generated by protobuf-ts 2.9.4 with parameter output_javascript_es2019
// @generated from protobuf file "bilibili/app/dynamic/v2/dynamic.proto" (package "bilibili.app.dynamic.v2", syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message bilibili.app.dynamic.v2.DynAllReply
 */
export interface DynAllReply {
    /**
     * @generated from protobuf field: bilibili.app.dynamic.v2.DynamicList dynamic_list = 1;
     */
    dynamicList?: DynamicList;
    /**
     * @generated from protobuf field: bilibili.app.dynamic.v2.CardVideoUpList up_list = 2;
     */
    upList?: CardVideoUpList;
    /**
     * @generated from protobuf field: bytes topic_list = 3;
     */
    topicList: Uint8Array;
}
/**
 * @generated from protobuf message bilibili.app.dynamic.v2.DynamicList
 */
export interface DynamicList {
    /**
     * @generated from protobuf field: repeated bilibili.app.dynamic.v2.DynamicItem list = 1;
     */
    list: DynamicItem[];
}
/**
 * @generated from protobuf message bilibili.app.dynamic.v2.CardVideoUpList
 */
export interface CardVideoUpList {
    /**
     * @generated from protobuf field: repeated bytes list = 2;
     */
    list: Uint8Array[];
    /**
     * @generated from protobuf field: int32 show_live_num = 4;
     */
    showLiveNum: number;
    /**
     * @generated from protobuf field: repeated bytes list_second = 10;
     */
    listSecond: Uint8Array[];
}
/**
 * @generated from protobuf message bilibili.app.dynamic.v2.DynamicItem
 */
export interface DynamicItem {
    /**
     * @generated from protobuf field: bilibili.app.dynamic.v2.DynamicType card_type = 1;
     */
    cardType: DynamicType;
}
/**
 * @generated from protobuf enum bilibili.app.dynamic.v2.DynamicType
 */
export declare enum DynamicType {
    /**
     * @generated from protobuf enum value: dyn_none = 0;
     */
    dyn_none = 0,
    /**
     * @generated from protobuf enum value: ad = 15;
     */
    ad = 15,
    /**
     * @generated from protobuf enum value: live_rcmd = 18;
     */
    live_rcmd = 18
}
declare class DynAllReply$Type extends MessageType<DynAllReply> {
    constructor();
    create(value?: PartialMessage<DynAllReply>): DynAllReply;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DynAllReply): DynAllReply;
    internalBinaryWrite(message: DynAllReply, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message bilibili.app.dynamic.v2.DynAllReply
 */
export declare const DynAllReply: DynAllReply$Type;
declare class DynamicList$Type extends MessageType<DynamicList> {
    constructor();
    create(value?: PartialMessage<DynamicList>): DynamicList;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DynamicList): DynamicList;
    internalBinaryWrite(message: DynamicList, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message bilibili.app.dynamic.v2.DynamicList
 */
export declare const DynamicList: DynamicList$Type;
declare class CardVideoUpList$Type extends MessageType<CardVideoUpList> {
    constructor();
    create(value?: PartialMessage<CardVideoUpList>): CardVideoUpList;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CardVideoUpList): CardVideoUpList;
    internalBinaryWrite(message: CardVideoUpList, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message bilibili.app.dynamic.v2.CardVideoUpList
 */
export declare const CardVideoUpList: CardVideoUpList$Type;
declare class DynamicItem$Type extends MessageType<DynamicItem> {
    constructor();
    create(value?: PartialMessage<DynamicItem>): DynamicItem;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DynamicItem): DynamicItem;
    internalBinaryWrite(message: DynamicItem, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message bilibili.app.dynamic.v2.DynamicItem
 */
export declare const DynamicItem: DynamicItem$Type;
export {};
