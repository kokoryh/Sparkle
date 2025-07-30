import { $ } from '@core/env';
import { JsonMessage } from '@core/message';
import {
    AccountInfo,
    AccountMine,
    FeedIndex,
    FeedIndexStory,
    GotoType,
    JsonOptions,
    Layout,
    Splash,
    StoryItem,
    VIP,
} from '@entity/bilibili';
import locale from '../locale';

export abstract class BilibiliJsonHandler<T extends { data: object | null }> extends JsonMessage<T> {
    protected options: JsonOptions = {
        showCreatorHub: false,
    };

    constructor() {
        super($.response.body as string);
        if (!this.message.data) {
            $.exit();
        }
        Object.assign(this.options, $.argument);
    }

    protected abstract process(): void;

    done(): void {
        this.process();
        $.done({ body: this.toJsonString() });
    }

    protected isEn(): boolean {
        return Boolean($.url.searchParams.get('s_locale')?.startsWith('en'));
    }
}

export class LayoutHandler extends BilibiliJsonHandler<Layout> {
    protected i18n = this.isEn() ? locale.enUS : locale.zhCN;

    private layoutData = {
        tab: [
            {
                pos: 1,
                id: 731,
                name: this.i18n.live,
                tab_id: '直播tab',
                uri: 'bilibili://live/home',
            },
            {
                pos: 2,
                id: 477,
                name: this.i18n.for_you,
                tab_id: '推荐tab',
                uri: 'bilibili://pegasus/promo',
                default_selected: 1,
            },
            {
                pos: 3,
                id: 478,
                name: this.i18n.trending,
                tab_id: '热门tab',
                uri: 'bilibili://pegasus/hottopic',
            },
            {
                pos: 4,
                id: 3502,
                name: this.i18n.anime,
                tab_id: 'bangumi',
                uri: 'bilibili://pgc/bangumi_v2',
            },
            {
                pos: 5,
                id: 3503,
                name: this.i18n.film,
                tab_id: 'film',
                uri: 'bilibili://pgc/cinema_v2',
            },
        ],
        top: [
            {
                pos: 1,
                id: 176,
                name: this.i18n.messages,
                tab_id: '消息Top',
                uri: 'bilibili://link/im_home',
                icon: 'http://i0.hdslb.com/bfs/archive/d43047538e72c9ed8fd8e4e34415fbe3a4f632cb.png',
            },
        ],
        bottom: [
            {
                pos: 1,
                id: 177,
                name: this.i18n.home,
                tab_id: 'home',
                uri: 'bilibili://main/home/',
                icon: 'http://i0.hdslb.com/bfs/archive/63d7ee88d471786c1af45af86e8cb7f607edf91b.png',
                icon_selected: 'http://i0.hdslb.com/bfs/archive/e5106aa688dc729e7f0eafcbb80317feb54a43bd.png',
            },
            {
                pos: 2,
                id: 179,
                name: this.i18n.following,
                tab_id: 'dynamic',
                uri: 'bilibili://following/home/',
                icon: 'http://i0.hdslb.com/bfs/archive/86dfbe5fa32f11a8588b9ae0fccb77d3c27cedf6.png',
                icon_selected: 'http://i0.hdslb.com/bfs/archive/25b658e1f6b6da57eecba328556101dbdcb4b53f.png',
            },
            {
                pos: 5,
                id: 181,
                name: this.i18n.me,
                tab_id: '我的Bottom',
                uri: 'bilibili://user_center/',
                icon: 'http://i0.hdslb.com/bfs/archive/4b0b2c49ffeb4f0c2e6a4cceebeef0aab1c53fe1.png',
                icon_selected: 'http://i0.hdslb.com/bfs/archive/a54a8009116cb896e64ef14dcf50e5cade401e00.png',
            },
        ],
    };

    protected process(): void {
        const { data } = this.message;
        Object.assign(data, this.layoutData);
    }
}

export class SplashHandler extends BilibiliJsonHandler<Splash> {
    private keyList = ['show', 'event_list'];

    protected process(): void {
        const { data } = this.message;
        this.keyList.forEach(key => {
            if (data[key]) {
                data[key] = [];
            }
        });
    }
}

export class FeedIndexHandler extends BilibiliJsonHandler<FeedIndex> {
    private typeSet = new Set([
        'small_cover_v2', // ios double column
        'large_cover_single_v9', // ios single column
        'large_cover_v1', // ipad
    ]);

    protected process(): void {
        const { data } = this.message;
        if (Array.isArray(data.items)) {
            data.items = data.items.filter(item => {
                return (
                    !item.banner_item && // remove banner
                    !item.ad_info &&
                    item.card_goto === GotoType.AV &&
                    this.typeSet.has(item.card_type)
                );
            });
        }
    }
}

export class FeedIndexStoryHandler extends BilibiliJsonHandler<FeedIndexStory> {
    private typeSet = new Set<GotoType>([
        GotoType.VERTICAL_AD_AV,
        GotoType.VERTICAL_AD_LIVE,
        GotoType.VERTICAL_AD_PICTURE,
    ]);

    protected process(): void {
        const { data } = this.message;
        if (Array.isArray(data.items)) {
            data.items = data.items.reduce((result: StoryItem[], item) => {
                if (!item.ad_info && item.card_goto && !this.typeSet.has(item.card_goto)) {
                    delete item.story_cart_icon;
                    delete item.free_flow_toast;
                    delete item.image_infos;
                    delete item.course_info;
                    delete item.game_info;
                    result.push(item);
                }
                return result;
            }, []);
        }
    }
}

export class AccountMineHandler extends BilibiliJsonHandler<AccountMine> {
    static getHundredAnnualVipData(): VIP {
        const image = this.getVipImage();
        return {
            status: 1,
            type: 2,
            vip_pay_type: 0,
            due_date: 9005270400000,
            tv_vip_status: 1,
            tv_vip_pay_type: 0,
            tv_due_date: 9005270400000,
            role: 15,
            theme_type: 0,
            nickname_color: '#FB7299',
            avatar_subscript: 1,
            avatar_subscript_url: '',
            avatar_icon: {
                icon_resource: {},
            },
            label: {
                path: '',
                text: '百年大会员',
                label_theme: 'hundred_annual_vip',
                text_color: '#FFFFFF',
                bg_style: 1,
                bg_color: '#FB7299',
                border_color: '',
                use_img_label: true,
                image,
                img_label_uri_hans: '',
                img_label_uri_hant: '',
                img_label_uri_hans_static: image,
                img_label_uri_hant_static: image,
            },
        };
    }

    protected static getVipImage(): string {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        switch (`${month}/${day}`) {
            case '6/1':
                return 'https://i0.hdslb.com/bfs/bangumi/kt/d2d09af98bd5aaead93493df9a20a73b474672f7.png';
            default:
                return 'https://i0.hdslb.com/bfs/vip/52f60c8bdae8d4440edbb96dad72916022adf126.png';
        }
    }

    protected i18n = this.isEn() ? locale.enUS : locale.zhCN;

    private sectionMap = {
        sections_v2: [
            {
                items: [
                    {
                        id: 396,
                        title: this.i18n.downloads,
                        uri: 'bilibili://user_center/download',
                        icon: 'http://i0.hdslb.com/bfs/archive/5fc84565ab73e716d20cd2f65e0e1de9495d56f8.png',
                        common_op_item: {},
                    },
                    {
                        id: 397,
                        title: this.i18n.history,
                        uri: 'bilibili://user_center/history',
                        icon: 'http://i0.hdslb.com/bfs/archive/8385323c6acde52e9cd52514ae13c8b9481c1a16.png',
                        common_op_item: {},
                    },
                    {
                        id: 3072,
                        title: this.i18n.my_favorites,
                        uri: 'bilibili://user_center/favourite?version=2',
                        icon: 'http://i0.hdslb.com/bfs/archive/d79b19d983067a1b91614e830a7100c05204a821.png',
                        common_op_item: {},
                    },
                    {
                        id: 2830,
                        title: this.i18n.watch_later,
                        uri: 'bilibili://user_center/watch_later_v2',
                        icon: 'http://i0.hdslb.com/bfs/archive/63bb768caa02a68cb566a838f6f2415f0d1d02d6.png',
                        need_login: 1,
                        common_op_item: {},
                    },
                ],
                style: 1,
                button: {},
            },
            {
                title: this.i18n.recommended_services,
                items: [
                    {
                        id: 402,
                        title: this.i18n.customization,
                        uri: 'https://www.bilibili.com/h5/mall/home?navhide=1&f_source=shop&from=myservice',
                        icon: 'http://i0.hdslb.com/bfs/archive/0bcad10661b50f583969b5a188c12e5f0731628c.png',
                        common_op_item: {},
                    },
                    {
                        id: 622,
                        title: this.i18n.mall,
                        uri: 'bilibili://mall/home',
                        icon: 'http://i0.hdslb.com/bfs/archive/19c794f01def1a267b894be84427d6a8f67081a9.png',
                        common_op_item: {},
                    },
                    {
                        id: 404,
                        title: this.i18n.my_wallet,
                        uri: 'bilibili://bilipay/mine_wallet',
                        icon: 'http://i0.hdslb.com/bfs/archive/f416634e361824e74a855332b6ff14e2e7c2e082.png',
                        common_op_item: {},
                    },
                    {
                        id: 406,
                        title: this.i18n.live_studio,
                        uri: 'bilibili://user_center/live_center',
                        icon: 'http://i0.hdslb.com/bfs/archive/1db5791746a0112890b77a0236baf263d71ecb27.png',
                        common_op_item: {},
                    },
                ],
                style: 1,
                button: {},
            },
            {
                title: this.i18n.more_services,
                items: [
                    {
                        id: 407,
                        title: this.i18n.help_center,
                        uri: 'bilibili://user_center/feedback',
                        icon: 'http://i0.hdslb.com/bfs/archive/7ca840cf1d887a45ee1ef441ab57845bf26ef5fa.png',
                        common_op_item: {},
                    },
                    {
                        id: 410,
                        title: this.i18n.settings,
                        uri: 'bilibili://user_center/setting',
                        icon: 'http://i0.hdslb.com/bfs/archive/e932404f2ee62e075a772920019e9fbdb4b5656a.png',
                        common_op_item: {},
                    },
                ],
                style: 2,
                button: {},
            },
        ],
        ipad_sections: [
            {
                id: 747,
                title: '离线缓存',
                uri: 'bilibili://user_center/download',
                icon: 'http://i0.hdslb.com/bfs/feed-admin/9bd72251f7366c491cfe78818d453455473a9678.png',
                mng_resource: {
                    icon_id: 0,
                    icon: '',
                },
            },
            {
                id: 748,
                title: '历史记录',
                uri: 'bilibili://user_center/history',
                icon: 'http://i0.hdslb.com/bfs/feed-admin/83862e10685f34e16a10cfe1f89dbd7b2884d272.png',
                mng_resource: {
                    icon_id: 0,
                    icon: '',
                },
            },
            {
                id: 749,
                title: '我的收藏',
                uri: 'bilibili://user_center/favourite',
                icon: 'http://i0.hdslb.com/bfs/feed-admin/6ae7eff6af627590fc4ed80c905e9e0a6f0e8188.png',
                mng_resource: {
                    icon_id: 0,
                    icon: '',
                },
            },
            {
                id: 750,
                title: '稍后再看',
                uri: 'bilibili://user_center/watch_later',
                icon: 'http://i0.hdslb.com/bfs/feed-admin/928ba9f559b02129e51993efc8afe95014edec94.png',
                mng_resource: {
                    icon_id: 0,
                    icon: '',
                },
            },
        ],
        ipad_upper_sections: [
            {
                id: 752,
                title: '创作首页',
                uri: '/uper/homevc',
                icon: 'http://i0.hdslb.com/bfs/feed-admin/d20dfed3b403c895506b1c92ecd5874abb700c01.png',
                mng_resource: {
                    icon_id: 0,
                    icon: '',
                },
            },
        ],
        ipad_recommend_sections: [
            {
                id: 755,
                title: '我的关注',
                uri: 'bilibili://user_center/myfollows',
                icon: 'http://i0.hdslb.com/bfs/feed-admin/fdd7f676030c6996d36763a078442a210fc5a8c0.png',
                mng_resource: {
                    icon_id: 0,
                    icon: '',
                },
            },
            {
                id: 756,
                title: '我的消息',
                uri: 'bilibili://link/im_home',
                icon: 'http://i0.hdslb.com/bfs/feed-admin/e1471740130a08a48b02a4ab29ed9d5f2281e3bf.png',
                mng_resource: {
                    icon_id: 0,
                    icon: '',
                },
            },
        ],
        ipad_more_sections: [
            {
                id: 763,
                title: '我的客服',
                uri: 'bilibili://user_center/feedback',
                icon: 'http://i0.hdslb.com/bfs/feed-admin/7801a6180fb67cf5f8ee05a66a4668e49fb38788.png',
                mng_resource: {
                    icon_id: 0,
                    icon: '',
                },
            },
            {
                id: 764,
                title: '设置',
                uri: 'bilibili://user_center/setting',
                icon: 'http://i0.hdslb.com/bfs/feed-admin/34e8faea00b3dd78977266b58d77398b0ac9410b.png',
                mng_resource: {
                    icon_id: 0,
                    icon: '',
                },
            },
        ],
    };

    private creatorHubData = {
        title: this.i18n.creator_hub,
        items: [
            {
                id: 171,
                title: this.i18n.creator_hub,
                uri: 'bilibili://uper/homevc',
                icon: 'http://i0.hdslb.com/bfs/archive/d3aad2d07538d2d43805f1fa14a412d7a45cc861.png',
                need_login: 1,
                global_red_dot: 0,
                display: 1,
                is_up_anchor: true,
            },
            {
                id: 533,
                title: this.i18n.data_center,
                uri: 'https://member.bilibili.com/york/data-center?navhide=1&from=profile',
                icon: 'http://i0.hdslb.com/bfs/feed-admin/367204ba56004b1a78211ba27eefbf5b4cc53a35.png',
                need_login: 1,
                global_red_dot: 0,
                display: 1,
            },
            {
                id: 707,
                title: this.i18n.host_center,
                uri: 'https://live.bilibili.com/p/html/live-app-anchor-center/index.html?is_live_webview=1#/',
                icon: 'http://i0.hdslb.com/bfs/feed-admin/48e17ccd0ce0cfc9c7826422d5e47ce98f064c2a.png',
                need_login: 1,
                display: 1,
            },
            {
                id: 2647,
                title: this.i18n.live_data,
                uri: 'https://live.bilibili.com/p/html/live-app-data/index.html?source_tag=0&foreground=pink&is_live_webview=1&hybrid_set_header=2#/',
                icon: 'https://i0.hdslb.com/bfs/legacy/0566b128c51d85b7ec545f318e1fd437d172dfea.png',
                display: 1,
            },
        ],
        style: 1,
        button: {
            text: this.i18n.upload,
            url: 'bilibili://uper/user_center/archive_selection',
            icon: 'http://i0.hdslb.com/bfs/archive/205f47675eaaca7912111e0e9b1ac94cb985901f.png',
            style: 1,
        },
        type: 1,
        up_title: this.i18n.creator_hub,
    };

    protected process(): void {
        const { showCreatorHub } = this.options;
        const { data } = this.message;
        Object.entries(this.sectionMap).forEach(([key, value]) => {
            if (data[key]) {
                data[key] = value;
            }
        });
        if (showCreatorHub && data.sections_v2) {
            data.sections_v2.splice(1, 0, this.creatorHubData);
        }
        data.vip_type = 2;
        data.vip = AccountMineHandler.getHundredAnnualVipData();
        delete data.answer;
        delete data.live_tip;
        delete data.vip_section;
        delete data.vip_section_v2;
        delete data.modular_vip_section;
    }
}

export class AccountInfoHandler extends BilibiliJsonHandler<AccountInfo> {
    protected process(): void {
        const { data } = this.message;
        data.vip = AccountMineHandler.getHundredAnnualVipData();
    }
}
