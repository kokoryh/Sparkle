import { matchPathSuffix, Router } from '@core/router';
import { getLayoutData, getSectionData, getCreatorHubData, getVIPData } from './data';
import { Layout, Splash, FeedIndex, CardType, GotoType, FeedIndexStory, AccountMine, AccountInfo } from './interface';
import { withI18n, interceptor, withArgument, Argument } from './middleware';

const router = new Router({
    matchPath: matchPathSuffix,
});

router.get('/show/tab/v2', withI18n, ctx => {
    const { data } = ctx.state.message as Layout;
    Object.assign(data, getLayoutData(ctx.state.i18n));
});

router.get(['/splash/list', '/splash/show', '/splash/event/list2'], interceptor, ctx => {
    const { data } = ctx.state.message as Splash;
    if (data.min_interval) {
        data.min_interval = 864000;
    }
    if (data.pull_interval) {
        data.pull_interval = 864000;
    }
    if (data.show) {
        data.show.length = 0;
    }
    if (data.event_list) {
        data.event_list.length = 0;
    }
});

router.get('/feed/index', ctx => {
    const { data } = ctx.state.message as FeedIndex;
    if (Array.isArray(data.items)) {
        const excludeTypes = [CardType.SMALL_COVER_V2, CardType.LARGE_COVER_SINGLE_V9, CardType.LARGE_COVER_V1];
        data.items = data.items.filter(item => {
            return (
                !item.banner_item && // remove banner
                !item.ad_info &&
                item.card_goto === GotoType.AV &&
                excludeTypes.includes(item.card_type)
            );
        });
    }
});

router.get('/feed/index/story', ctx => {
    const { data } = ctx.state.message as FeedIndexStory;
    if (Array.isArray(data.items)) {
        const excludeTypes = [GotoType.VERTICAL_AD_AV, GotoType.VERTICAL_AD_LIVE, GotoType.VERTICAL_AD_PICTURE];
        data.items = data.items.filter(item => {
            if (!item.ad_info && item.card_goto && !excludeTypes.includes(item.card_goto)) {
                item.story_cart_icon = undefined;
                item.free_flow_toast = undefined;
                item.image_infos = undefined;
                item.course_info = undefined;
                item.game_info = undefined;
                return true;
            }
            return false;
        }, []);
    }
});

router.get(['/account/mine', '/account/mine/ipad'], withArgument, withI18n, ctx => {
    const { showCreatorHub } = ctx.argument as Argument;
    const { data } = ctx.state.message as AccountMine;
    const i18n = ctx.state.i18n;
    for (const [key, value] of Object.entries(getSectionData(i18n))) {
        if (data[key]) {
            data[key] = value;
        }
    }
    if (showCreatorHub && data.sections_v2) {
        data.sections_v2.splice(1, 0, getCreatorHubData(i18n));
    }
    data.vip = getVIPData();
    data.vip_type = 2;
    data.answer = undefined;
    data.live_tip = undefined;
    data.vip_section = undefined;
    data.vip_section_v2 = undefined;
    data.modular_vip_section = undefined;
});

router.get('/account/myinfo', ctx => {
    const { data } = ctx.state.message as AccountInfo;
    data.vip = getVIPData();
});

export default router;
