export interface JsonOptions {
    showCreatorHub: boolean | number;
}

export interface ProtobufOptions {
    showUpList: 'auto' | 'show' | 'hide';
    filterTopReplies: boolean | number;
    airborne: boolean | string;
}

export interface LayoutItem {
    pos: number;
    id: number;
    name: string;
    tab_id: string;
    uri: string;
    default_selected?: number;
    icon?: string;
    icon_selected?: string;
}

export interface Layout {
    data: {
        tab: LayoutItem[];
        top: LayoutItem[];
        bottom: LayoutItem[];
    };
}

export interface Splash {
    data: {
        show: unknown[];
        event_list: unknown[];
    };
}

export interface FeedIndex {
    data: {
        items: {
            banner_item: unknown[];
            ad_info: unknown;
            card_goto: string;
            card_type: string;
        }[];
    };
}

export interface StoryItem {
    ad_info?: unknown;
    card_goto?: string;
    story_cart_icon?: unknown;
    free_flow_toast?: unknown;
}

export interface FeedIndexStory {
    data: {
        items: StoryItem[];
    };
}

export interface AccountMine {
    data: {
        sections_v2?: unknown[];
        ipad_sections?: unknown[];
        ipad_upper_sections?: unknown[];
        ipad_recommend_sections?: unknown[];
        ipad_more_sections?: unknown[];
        answer?: unknown;
        live_tip?: unknown;
        vip_section?: unknown;
        vip_section_v2?: unknown;
        modular_vip_section?: unknown;
        vip_type: number;
        vip: VIP;
    };
}

export interface AccountInfo {
    data: {
        vip: VIP;
    };
}

export interface VIP {
    status: number;
    type: number;
    vip_pay_type: number;
    due_date: number;
    tv_vip_status: number;
    tv_vip_pay_type: number;
    tv_due_date: number;
    role: number;
    theme_type: number;
    nickname_color: string;
    avatar_subscript: number;
    avatar_subscript_url: string;
    avatar_icon: {
        icon_resource: {};
    };
    label: {
        path: string;
        text: string;
        label_theme: string;
        text_color: string;
        bg_style: number;
        bg_color: string;
        border_color: string;
        use_img_label: boolean;
        image: string;
        img_label_uri_hans: string;
        img_label_uri_hant: string;
        img_label_uri_hans_static: string;
        img_label_uri_hant_static: string;
    };
}

export interface SegmentItem {
    cid: string;
    category: string;
    actionType: string;
    segment: [number, number];
    UUID: string;
    videoDuration: number;
    locked: number;
    votes: number;
    description: string;
}

export interface ChronosConfig {
    sourceMd5: string;
    processedMd5: string;
}

export interface ChronosConfigs {
    universal: ChronosConfig;
    hd: ChronosConfig;
}
