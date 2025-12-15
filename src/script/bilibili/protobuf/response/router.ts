import { matchUrlSuffix, Router } from '@core/router';
import { handleDefaultWordsReply, handleModeStatusReply, handleTFInfoReply } from '../deprecated-handler';
import {
    handleDynAllReply,
    handlePlayViewUniteReply,
    handlePlayViewReply,
    handlePopularReply,
    handleIpadViewReply,
    handleIpadViewProgressReply,
    handleViewProgressReply,
    handleRelatesFeedReply,
    handleViewReply,
    handleDmViewReply,
    handleMainListReply,
    handleIpadPlayViewReply,
    handleSearchAllResponse,
} from '../handler';
import { withArgument } from '../middleware';

const router = new Router({
    matchPath: matchUrlSuffix,
});

router.post('v2.Dynamic/DynAll', withArgument, handleDynAllReply);
router.post('playerunite.v1.Player/PlayViewUnite', handlePlayViewUniteReply);
router.post('playurl.v1.PlayURL/PlayView', handlePlayViewReply);
router.post('v1.Popular/Index', handlePopularReply);
router.post('view.v1.View/View', handleIpadViewReply);
router.post('view.v1.View/ViewProgress', withArgument, handleIpadViewProgressReply);
router.post('viewunite.v1.View/ViewProgress', withArgument, handleViewProgressReply);
router.post('viewunite.v1.View/RelatesFeed', handleRelatesFeedReply);
router.post('viewunite.v1.View/View', handleViewReply);
router.post('v1.DM/DmView', handleDmViewReply);
router.post('v1.Reply/MainList', withArgument, handleMainListReply);
router.post('v2.PlayURL/PlayView', handleIpadPlayViewReply);
router.post('v1.Search/SearchAll', handleSearchAllResponse);

// router.post('v1.Search/DefaultWords', handleDefaultWordsReply);
// router.post('v1.Teenagers/ModeStatus', handleModeStatusReply);
// router.post('view.v1.View/TFInfo', handleTFInfoReply);

export default router;
