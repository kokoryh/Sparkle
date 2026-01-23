import { DefaultWordsReply } from '@proto/bilibili/app/interface/v1/search';
import { ModeStatusReply } from '@proto/bilibili/app/interface/v1/teenagers';
import { TFInfoReply } from '@proto/bilibili/app/view/v1/view';
import { Middleware } from '@core/middleware';

export const handleDefaultWordsReq: Middleware = (ctx, next) => {
    ctx.response.headers = { 'content-type': 'application/grpc' };
    ctx.response.bodyBytes = new Uint8Array([
        0, 0, 0, 0, 33, 26, 29, 230, 144, 156, 231, 180, 162, 232, 167, 134, 233, 162, 145, 227, 128, 129, 231, 149,
        170, 229, 137, 167, 230, 136, 150, 117, 112, 228, 184, 187, 40, 1,
    ]);
    return next();
};

export const handleDefaultWordsReply: Middleware = (ctx, next) => {
    const message = DefaultWordsReply.fromBinary(ctx.response.bodyBytes);
    message.show = '搜索视频、番剧或up主';
    message.word = '';
    message.goto = '';
    message.value = '';
    message.uri = '';
    ctx.response.bodyBytes = DefaultWordsReply.toBinary(message);
    return next();
};

export const handleModeStatusReq: Middleware = (ctx, next) => {
    ctx.response.headers = { 'content-type': 'application/grpc' };
    ctx.response.bodyBytes = new Uint8Array([
        0, 0, 0, 0, 19, 10, 17, 8, 2, 18, 9, 116, 101, 101, 110, 97, 103, 101, 114, 115, 32, 2, 42, 0,
    ]);
    return next();
};

export const handleModeStatusReply: Middleware = (ctx, next) => {
    const message = ModeStatusReply.fromBinary(ctx.response.bodyBytes);
    const teenagersModel = message.userModels.find(item => item.mode === 'teenagers');
    if (teenagersModel?.policy?.interval && teenagersModel.policy.interval !== '0') {
        teenagersModel.policy.interval = '0';
    }
    ctx.response.bodyBytes = ModeStatusReply.toBinary(message);
    return next();
};

export const handleTFInfoReq: Middleware = (ctx, next) => {
    ctx.response.headers = { 'content-type': 'application/grpc' };
    ctx.response.bodyBytes = new Uint8Array([0, 0, 0, 0, 0]);
    return next();
};

export const handleTFInfoReply: Middleware = (ctx, next) => {
    const message = TFInfoReply.fromBinary(ctx.response.bodyBytes);
    if (message.tipsId !== '0') {
        message.tfToast = undefined;
        message.tfPanelCustomized = undefined;
    }
    ctx.response.bodyBytes = TFInfoReply.toBinary(message);
    return next();
};

export const handleViewEndPageReq = handleTFInfoReq;
