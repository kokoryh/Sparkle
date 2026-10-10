import { matchUrlSuffix, Router } from '@core/router';
import { transformGrpcResponse } from '@core/middleware';
import {
    fetchUpstream,
    handleDmSegMobileReq,
    handleDmSegMobileReply,
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

router.post('v1.DM/DmSegMobile', handleDmSegMobileReq, transformGrpcResponse, handleDmSegMobileReply);
router.post('viewunite.v1.View/View', fetchUpstream, transformGrpcResponse, handleViewReply);
router.post('v1.Reply/MainList', fetchUpstream, transformGrpcResponse, handleMainListReply);

// router.post('v1.Search/DefaultWords', handleDefaultWordsReq);
// router.post('v1.Teenagers/ModeStatus', handleModeStatusReq);
// router.post('view.v1.View/TFInfo', handleTFInfoReq);
// router.post('viewunite.v1.View/ViewEndPage', handleViewEndPageReq);

export { router };
