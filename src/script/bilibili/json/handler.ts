import { Middleware } from '@core/middleware';
import { getLayoutData, getSectionData, getCreatorHubData, getVIPData } from './data';
import { Layout, Splash, FeedIndex, CardType, GotoType, FeedIndexStory, AccountMine, AccountInfo } from './types';
import { Argument } from './middleware';

function patchValue(target: Record<string, any> | Record<string, any>[], patch: Record<string, any>): void {
    const keys = Object.keys(patch);
    for (const obj of Array.isArray(target) ? target : [target]) {
        for (const key of keys) {
            if (key in obj) {
                obj[key] = patch[key];
            }
        }
    }
}

export const handleLayout: Middleware = (ctx, next) => {
    const { data } = ctx.state.message as Layout;

    patchValue(data, getLayoutData(ctx.state.i18n));

    return next();
};

export const handleSplash: Middleware = (ctx, next) => {
    const { data } = ctx.state.message as Splash;

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

export const handleFeedIndex: Middleware = (ctx, next) => {
    const { data } = ctx.state.message as FeedIndex;

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

export const handleFeedIndexStory: Middleware = (ctx, next) => {
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

    return next();
};

export const handleAccountMine: Middleware = (ctx, next) => {
    const { showCreatorHub } = ctx.argument as Argument;
    const { data } = ctx.state.message as AccountMine;
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

export const handleAccountMyInfo: Middleware = (ctx, next) => {
    const { data } = ctx.state.message as AccountInfo;

    data.vip = getVIPData();

    return next();
};
