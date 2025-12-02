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

router.add('v1.DM/DmSegMobile', handleDmSegMobileReq, parseGrpcResponse, handleDmSegMobileReply);
router.add('viewunite.v1.View/View', handleRequest, parseGrpcResponse, handleViewReply);
router.add('v1.Reply/MainList', handleRequest, parseGrpcResponse, handleMainListReply);

// router.add('v1.Search/DefaultWords', handleDefaultWordsReq);
// router.add('v1.Teenagers/ModeStatus', handleModeStatusReq);
// router.add('view.v1.View/TFInfo', handleTFInfoReq);
// router.add('viewunite.v1.View/ViewEndPage', handleViewEndPageReq);

export default router;
