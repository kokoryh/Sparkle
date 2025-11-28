import { Router } from '@core/router';
import { parseGrpcResponse } from '@core/middleware';
import {
    handleDmSegMobileReq,
    handleDmSegMobileReply,
    handleRequest,
    handleViewReply,
    handleMainListReply,
} from '../handler';

const router = new Router({
    matchPath: (layer, ctx) => ctx.request.url.endsWith(layer.path as string),
});

router.add('v1.DM/DmSegMobile', handleDmSegMobileReq, parseGrpcResponse, handleDmSegMobileReply);
router.add('viewunite.v1.View/View', handleRequest, parseGrpcResponse, handleViewReply);
router.add('v1.Reply/MainList', handleRequest, parseGrpcResponse, handleMainListReply);

export default router;
