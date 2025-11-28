import { matchUrlSuffix, Router } from '@core/router';
import { parseGrpcResponse } from '@core/middleware';
import {
    handleDmSegMobileReq,
    handleDmSegMobileReply,
    handleRequest,
    handleViewReply,
    handleMainListReply,
} from '../handler';

const router = new Router({
    matchPath: matchUrlSuffix,
});

router.add('v1.DM/DmSegMobile', handleDmSegMobileReq, parseGrpcResponse, handleDmSegMobileReply);
router.add('viewunite.v1.View/View', handleRequest, parseGrpcResponse, handleViewReply);
router.add('v1.Reply/MainList', handleRequest, parseGrpcResponse, handleMainListReply);

export default router;
