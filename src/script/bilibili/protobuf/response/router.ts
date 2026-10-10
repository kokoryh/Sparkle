import { matchUrlSuffix, Router } from '@core/router';
import { setupArgument } from '../middleware';
import {
    handleDynAllReply,
    handlePlayViewUniteReply,
    handlePlayViewReply,
    handlePopularReply,
    handleIpadViewReply,
    handleIpadViewProgressReply,
    handleIpadRelatesFeedReply,
    handleViewProgressReply,
    handleRelatesFeedReply,
    handleViewReply,
    handleAIRelateAsyncReply,
    handleDmViewReply,
    handleMainListReply,
    handleIpadPlayViewReply,
    handleSearchAllResponse,
} from '../handler';
// import { handleDefaultWordsReply, handleModeStatusReply, handleTFInfoReply } from '../deprecated-handler';

const router = new Router({
    matchPath: matchUrlSuffix,
});

router.post('v2.Dynamic/DynAll', setupArgument, handleDynAllReply);
router.post('playerunite.v1.Player/PlayViewUnite', handlePlayViewUniteReply);
router.post('playurl.v1.PlayURL/PlayView', handlePlayViewReply);
router.post('v1.Popular/Index', handlePopularReply);
router.post('view.v1.View/View', handleIpadViewReply);
router.post('view.v1.View/ViewProgress', setupArgument, handleIpadViewProgressReply);
router.post('view.v1.View/RelatesFeed', handleIpadRelatesFeedReply);
router.post('viewunite.v1.View/ViewProgress', setupArgument, handleViewProgressReply);
router.post('viewunite.v1.View/RelatesFeed', handleRelatesFeedReply);
router.post('viewunite.v1.View/View', handleViewReply);
router.post('viewunite.v1.View/AIRelateAsync', handleAIRelateAsyncReply);
router.post('v1.DM/DmView', handleDmViewReply);
router.post('v1.Reply/MainList', setupArgument, handleMainListReply);
router.post('v2.PlayURL/PlayView', handleIpadPlayViewReply);
router.post('v1.Search/SearchAll', handleSearchAllResponse);

// router.post('v1.Search/DefaultWords', handleDefaultWordsReply);
// router.post('v1.Teenagers/ModeStatus', handleModeStatusReply);
// router.post('view.v1.View/TFInfo', handleTFInfoReply);

export { router };
