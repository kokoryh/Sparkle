import { matchPathSuffix, Router } from '@core/router';
import {
    handleAccountMine,
    handleAccountMyInfo,
    handleFeedIndex,
    handleFeedIndexStory,
    handleLayout,
    handleSplash,
} from './handler';
import { initI18n, interceptor, initArgument } from './middleware';

const router = new Router({
    matchPath: matchPathSuffix,
});

router.get('/show/tab/v2', initI18n, handleLayout);
router.get(['/splash/list', '/splash/show', '/splash/event/list2'], interceptor, handleSplash);
router.get('/feed/index', handleFeedIndex);
router.get('/feed/index/story', handleFeedIndexStory);
router.get(['/account/mine', '/account/mine/ipad'], initArgument, initI18n, handleAccountMine);
router.get('/account/myinfo', handleAccountMyInfo);

export default router;
