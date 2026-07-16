import { matchUrlSuffix, Router } from '@core/router';
import { parseGRPCResponse } from '@core/middleware';
import {
    handleDmSegMobileReq,
    handleDmSegMobileReply,
    handleRequest,
    handleViewReply,
    handleMainListReply,
} from '../handler';
// import {
//     handleDefaultWordsReq,
//     handleModeStatusReq,
//     handleTFInfoReq,
//     handleViewEndPageReq,
// } from '../deprecated-handler';

const router = new Router({
    matchPath: matchUrlSuffix,
});

router.post('v1.DM/DmSegMobile', handleDmSegMobileReq, parseGRPCResponse, handleDmSegMobileReply);
router.post('viewunite.v1.View/View', handleRequest, parseGRPCResponse, handleViewReply);
router.post('v1.Reply/MainList', handleRequest, parseGRPCResponse, handleMainListReply);

// router.post('v1.Search/DefaultWords', handleDefaultWordsReq);
// router.post('v1.Teenagers/ModeStatus', handleModeStatusReq);
// router.post('view.v1.View/TFInfo', handleTFInfoReq);
// router.post('viewunite.v1.View/ViewEndPage', handleViewEndPageReq);

export { router };
