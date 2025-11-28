import { matchUrlSuffix, Router } from '@core/router';
import {
    handleDynAllReply,
    handleDefaultWordsReply,
    handleModeStatusReply,
    handlePlayViewUniteReply,
    handlePlayViewReply,
    handlePopularReply,
    handleTFInfoReply,
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

router.add('v2.Dynamic/DynAll', withArgument, handleDynAllReply);
// router.add('v1.Search/DefaultWords', handleDefaultWordsReply);
// router.add('v1.Teenagers/ModeStatus', handleModeStatusReply);
router.add('playerunite.v1.Player/PlayViewUnite', handlePlayViewUniteReply);
router.add('playurl.v1.PlayURL/PlayView', handlePlayViewReply);
router.add('v1.Popular/Index', handlePopularReply);
// router.add('view.v1.View/TFInfo', handleTFInfoReply);
router.add('view.v1.View/View', handleIpadViewReply);
router.add('view.v1.View/ViewProgress', withArgument, handleIpadViewProgressReply);
router.add('viewunite.v1.View/ViewProgress', withArgument, handleViewProgressReply);
router.add('viewunite.v1.View/RelatesFeed', handleRelatesFeedReply);
router.add('viewunite.v1.View/View', handleViewReply);
router.add('v1.DM/DmView', handleDmViewReply);
router.add('v1.Reply/MainList', withArgument, handleMainListReply);
router.add('v2.PlayURL/PlayView', handleIpadPlayViewReply);
router.add('v1.Search/SearchAll', handleSearchAllResponse);

export default router;
