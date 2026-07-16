import { getLayoutData, getSectionData, getCreatorHubData, getVIPData } from './data';
import {
    Layout,
    Splash,
    FeedIndex,
    CardType,
    GotoType,
    FeedIndexStory,
    AccountMine,
    AccountInfo,
    LiveRoomInfo,
    LiveCardType,
    LiveFeedInfo,
    LiveUserInfo,
} from './types';
import { Middleware } from './middleware';

function patchValue<T extends object, P extends object>(target: T | T[], patch: P): void {
    const keys = Object.keys(patch);
    for (const obj of Array.isArray(target) ? target : [target]) {
        for (const key of keys) {
            if (Object.hasOwn(obj, key)) {
                (obj as Record<string, unknown>)[key] = (patch as Record<string, unknown>)[key];
            }
        }
    }
}

export const handleLayout: Middleware<Layout> = (ctx, next) => {
    const { data } = ctx.state.message;

    patchValue(data, getLayoutData(ctx.state.i18n));

    return next();
};

export const handleSplash: Middleware<Splash> = (ctx, next) => {
    const { data } = ctx.state.message;

    patchValue(data, {
        account: undefined,
        event_list: undefined,
        preload: undefined,
        show: undefined,
        max_time: 0,
        min_interval: 31536000,
        pull_interval: 31536000,
    });

    if (Array.isArray(data.list)) {
        patchValue(data.list, {
            duration: 0,
            begin_time: 2524579200,
            end_time: 2524665599,
            enable_pre_download: false,
        });
    }

    return next();
};

export const handleFeedIndex: Middleware<FeedIndex> = (ctx, next) => {
    const { data } = ctx.state.message;

    if (Array.isArray(data.items)) {
        const includeTypes = [CardType.SMALL_COVER_V2, CardType.LARGE_COVER_SINGLE_V9, CardType.LARGE_COVER_V1];
        data.items = data.items.filter(item => {
            return (
                !item.banner_item && // remove banner
                !item.ad_info &&
                item.card_goto === GotoType.AV &&
                includeTypes.includes(item.card_type)
            );
        });
    }

    return next();
};

export const handleFeedIndexStory: Middleware<FeedIndexStory> = (ctx, next) => {
    const { data } = ctx.state.message;

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

    return next();
};

export const handleAccountMine: Middleware<AccountMine> = (ctx, next) => {
    const { showCreatorHub } = ctx.argument;
    const { data } = ctx.state.message;
    const { i18n } = ctx.state;

    patchValue(data, getSectionData(i18n));

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

    return next();
};

export const handleAccountMyInfo: Middleware<AccountInfo> = (ctx, next) => {
    const { data } = ctx.state.message;

    data.vip = getVIPData();

    return next();
};

export const handleLiveFeedInfo: Middleware<LiveFeedInfo> = (ctx, next) => {
    const { data } = ctx.state.message;

    if (Array.isArray(data.card_list)) {
        const excludeTypes = [LiveCardType.BANNER_V2, LiveCardType.ACTIVITY_CARD_V1];
        data.card_list = data.card_list.filter(item => !excludeTypes.includes(item.card_type));
    }

    return next();
};

export const handleLiveRoomInfo: Middleware<LiveRoomInfo> = (ctx, next) => {
    const { data } = ctx.state.message;

    data.big_card_info = null;
    data.show_reserve_status = false;
    if (data.reserve_info) data.reserve_info.show_reserve_status = false;
    if (data.shopping_info) data.shopping_info.is_show = 0;

    if (data.activity_banner_info) {
        setAllValuesToNull(data.activity_banner_info);
    }

    if (data.function_card) {
        setAllValuesToNull(data.function_card);
    }

    if (data.new_tab_info) {
        const newTabInfo = data.new_tab_info;
        if (Array.isArray(newTabInfo.outer_list)) {
            newTabInfo.outer_list = newTabInfo.outer_list.filter(item => item.biz_id !== 33);
        }

        if (Array.isArray(newTabInfo.candidate_list) && Array.isArray(newTabInfo.v2_outer_list)) {
            const excludeBizIds = [33, 36, 162, 186];
            newTabInfo.candidate_list = newTabInfo.candidate_list.filter(item => !excludeBizIds.includes(item.biz_id));
            newTabInfo.v2_outer_list.forEach(item => {
                item.indices = item.indices.filter(id => !excludeBizIds.includes(id));
            });
        }
    }

    if (data.room_info.short_id === 255) {
        data.room_info.background_render_type = 0;
        data.room_info.app_background = 'https://i0.hdslb.com/bfs/new_dyn/2dd8a4aa9fde3587b1a716957a07337013999324.png';
    }

    return next();
};

export const handleLiveUserInfo: Middleware<LiveUserInfo> = (ctx, next) => {
    const { data } = ctx.state.message;

    data.play_together_info = undefined;
    data.play_together_info_v2 = undefined;

    if (data.function_card) {
        setAllValuesToNull(data.function_card);
    }

    return next();
};

function setAllValuesToNull(functionCard: Record<string, unknown>) {
    Object.keys(functionCard).forEach(key => (functionCard[key] = null));
}
