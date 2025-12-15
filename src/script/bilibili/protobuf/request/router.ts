import { matchUrlSuffix, Router } from '@core/router';
import { parseGrpcResponse } from '@core/middleware';
import {
    handleDefaultWordsReq,
    handleModeStatusReq,
    handleTFInfoReq,
    handleViewEndPageReq,
} from '../deprecated-handler';
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

router.post('v1.DM/DmSegMobile', handleDmSegMobileReq, parseGrpcResponse, handleDmSegMobileReply);
router.post('viewunite.v1.View/View', handleRequest, parseGrpcResponse, handleViewReply);
router.post('v1.Reply/MainList', handleRequest, parseGrpcResponse, handleMainListReply);

// router.post('v1.Search/DefaultWords', handleDefaultWordsReq);
// router.post('v1.Teenagers/ModeStatus', handleModeStatusReq);
// router.post('view.v1.View/TFInfo', handleTFInfoReq);
// router.post('viewunite.v1.View/ViewEndPage', handleViewEndPageReq);

export default router;
