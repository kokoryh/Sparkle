import { Router } from '@core/router';
import { getLayoutData, getSectionData, getCreatorHubData, getVIPData } from './data';
import { Layout, Splash, FeedIndex, GotoType, FeedIndexStory, StoryItem, AccountMine, AccountInfo } from './interface';
import { withI18n, interceptor, withArgument, Argument } from './middleware';

const router = new Router({
    matchPath: (layer, ctx) => ctx.path.endsWith(layer.path as string),
});

router.add('/show/tab/v2', withI18n, ctx => {
    const { data } = ctx.state.message as Layout;
    Object.assign(data, getLayoutData(ctx.state.i18n));
});

router.add(['/splash/list', '/splash/show', '/splash/event/list2'], interceptor, ctx => {
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

router.add('/feed/index', ctx => {
    const { data } = ctx.state.message as FeedIndex;
    const excludeTypes = [
        'small_cover_v2', // ios double column
        'large_cover_single_v9', // ios single column
        'large_cover_v1', // ipad
    ];
    if (Array.isArray(data.items)) {
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

router.add('/feed/index/story', ctx => {
    const { data } = ctx.state.message as FeedIndexStory;
    const excludeTypes = [GotoType.VERTICAL_AD_AV, GotoType.VERTICAL_AD_LIVE, GotoType.VERTICAL_AD_PICTURE];
    if (Array.isArray(data.items)) {
        data.items = data.items.reduce((memo: StoryItem[], item: StoryItem) => {
            if (!item.ad_info && item.card_goto && !excludeTypes.includes(item.card_goto)) {
                delete item.story_cart_icon;
                delete item.free_flow_toast;
                delete item.image_infos;
                delete item.course_info;
                delete item.game_info;
                memo.push(item);
            }
            return memo;
        }, []);
    }
});

router.add(['/account/mine', '/account/mine/ipad'], withArgument, withI18n, ctx => {
    const { data } = ctx.state.message as AccountMine;
    const { showCreatorHub } = ctx.argument as Argument;
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
    delete data.answer;
    delete data.live_tip;
    delete data.vip_section;
    delete data.vip_section_v2;
    delete data.modular_vip_section;
});

router.add('/account/myinfo', ctx => {
    const { data } = ctx.state.message as AccountInfo;
    data.vip = getVIPData();
});

export default router;
