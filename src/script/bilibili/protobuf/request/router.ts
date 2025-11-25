import { Router } from '@core/router';
import { parseGrpcResponse } from '@core/middleware';
import {
    handleDmSegMobileReq,
    handleDmSegMobileReply,
    handleRequest,
    handleViewReply,
    handleMainListReply,
} from '../handler';
import { withArgument } from '../middleware';

const router = new Router({
    matchPath: (layer, ctx) => ctx.request.url.endsWith(layer.path as string),
});

router.add('v1.DM/DmSegMobile', withArgument, handleDmSegMobileReq, parseGrpcResponse, handleDmSegMobileReply);
router.add('viewunite.v1.View/View', handleRequest, parseGrpcResponse, handleViewReply);
router.add('v1.Reply/MainList', withArgument, handleRequest, parseGrpcResponse, handleMainListReply);

export default router;
