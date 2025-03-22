// @generated by protobuf-ts 2.9.4 with parameter output_javascript_es2019
// @generated from protobuf file "bilibili/app/interface/v1/teenagers.proto" (package "bilibili.app.interface.v1", syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message bilibili.app.interface.v1.ModeStatusReply
 */
export interface ModeStatusReply {
    /**
     * @generated from protobuf field: repeated bilibili.app.interface.v1.UserModel user_models = 1;
     */
    userModels: UserModel[];
}
/**
 * @generated from protobuf message bilibili.app.interface.v1.UserModel
 */
export interface UserModel {
    /**
     * @generated from protobuf field: string mode = 2;
     */
    mode: string;
    /**
     * @generated from protobuf field: bilibili.app.interface.v1.Policy policy = 5;
     */
    policy?: Policy;
}
/**
 * @generated from protobuf message bilibili.app.interface.v1.Policy
 */
export interface Policy {
    /**
     * @generated from protobuf field: int64 interval = 1;
     */
    interval: bigint;
}
declare class ModeStatusReply$Type extends MessageType<ModeStatusReply> {
    constructor();
    create(value?: PartialMessage<ModeStatusReply>): ModeStatusReply;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ModeStatusReply): ModeStatusReply;
    internalBinaryWrite(message: ModeStatusReply, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message bilibili.app.interface.v1.ModeStatusReply
 */
export declare const ModeStatusReply: ModeStatusReply$Type;
declare class UserModel$Type extends MessageType<UserModel> {
    constructor();
    create(value?: PartialMessage<UserModel>): UserModel;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UserModel): UserModel;
    internalBinaryWrite(message: UserModel, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message bilibili.app.interface.v1.UserModel
 */
export declare const UserModel: UserModel$Type;
declare class Policy$Type extends MessageType<Policy> {
    constructor();
    create(value?: PartialMessage<Policy>): Policy;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Policy): Policy;
    internalBinaryWrite(message: Policy, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message bilibili.app.interface.v1.Policy
 */
export declare const Policy: Policy$Type;
export {};
