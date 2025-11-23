import { Router } from '@core/router';
import { parseGrpcResponse } from '@core/middleware';
import {
    fetchRequest,
    handleDmSegMobileReply,
    handleDmSegMobileReq,
    handleMainListReply,
    handleViewReply,
} from '../handler';
import { withArgument } from '../middleware';

const router = new Router({
    matchPath: (layer, ctx) => ctx.request.url.endsWith(layer.path as string),
});

router.add('v1.DM/DmSegMobile', handleDmSegMobileReq, parseGrpcResponse, handleDmSegMobileReply);
router.add('viewunite.v1.View/View', fetchRequest, parseGrpcResponse, handleViewReply);
router.add('v1.Reply/MainList', fetchRequest, parseGrpcResponse, withArgument, handleMainListReply);

export default router;
