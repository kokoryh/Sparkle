import { MessageType } from '@protobuf-ts/runtime';
import { DynAllReply, DynamicType } from '@proto/bilibili/app/dynamic/v2/dynamic';
import { DefaultWordsReply } from '@proto/bilibili/app/interface/v1/search';
import { ModeStatusReply } from '@proto/bilibili/app/interface/v1/teenagers';
import { PlayViewUniteReply } from '@proto/bilibili/app/playerunite/v1/player';
import { PlayViewReply } from '@proto/bilibili/app/playurl/v1/playurl';
import { PopularReply } from '@proto/bilibili/app/show/popular/v1/popular';
import {
    Chronos,
    TFInfoReply,
    ViewReply as IpadViewReply,
    ViewProgressReply as IpadViewProgressReply,
} from '@proto/bilibili/app/view/v1/view';
import {
    Module,
    ModuleType,
    RelateCardType,
    RelatesFeedReply,
    ViewReply,
    ViewProgressReply,
    RelateCard,
} from '@proto/bilibili/app/viewunite/v1/view';
import { DmViewReply } from '@proto/bilibili/community/service/dm/v1/dm';
import { MainListReply, Type } from '@proto/bilibili/main/community/reply/v1/reply';
import { PlayViewReply as IpadPlayViewReply } from '@proto/bilibili/pgc/gateway/player/v2/playurl.js';
import { SearchAllResponse } from '@proto/bilibili/polymer/app/search/v1/search';
import { $ } from '@core/env';
import { isIPad } from '@utils/index';
import { getAppEdition } from '@utils/bilibili';
import { BilibiliProtobufHandler } from '../base';

export abstract class BilibiliResponseHandler<T extends object> extends BilibiliProtobufHandler<T> {
    protected options: {
        showUpList: 'auto' | 'show' | 'hide';
        purifyTopReplies: boolean | number;
        airborne: boolean | string;
    } = {
        showUpList: 'show',
        purifyTopReplies: true,
        airborne: true,
    };

    constructor(type: MessageType<T>) {
        super(type, $.response.bodyBytes!);
        Object.assign(this.options, $.argument);
        $.debug($.request.url, this.options);
    }

    done(): void {
        $.done({
            body: this.toBinary(),
        });
    }

    process(): this {
        this._process(this.message);
        return this;
    }

    protected abstract _process(message: T): void;

    protected isAirborneEnabled(): boolean {
        const { airborne } = this.options;
        return Boolean(airborne && airborne !== '#');
    }
}

export class DynAllReplyMessage extends BilibiliResponseHandler<DynAllReply> {
    constructor() {
        super(DynAllReply);
    }

    protected _process(message: DynAllReply): void {
        delete message.topicList;
        if (message.dynamicList) {
            message.dynamicList.list = message.dynamicList.list.filter(
                item => ![DynamicType.AD, DynamicType.LIVE_RCMD].includes(item.cardType)
            );
        }
        this.processUpList(message);
    }

    private processUpList(message: DynAllReply): void {
        const { showUpList } = this.options;
        if (showUpList === 'show' || isIPad()) {
            return;
        }
        if (showUpList === 'hide' || !message.upList?.showLiveNum) {
            delete message.upList;
            return;
        }
        const { list, listSecond } = message.upList;
        const lastItem = listSecond.at(-1);
        if (lastItem) {
            lastItem.separator = true;
            message.upList.list = [...listSecond, ...list];
            listSecond.length = 0;
        }
    }
}

/**
 * @deprecated
 */
export class DefaultWordsReplyHandler extends BilibiliResponseHandler<DefaultWordsReply> {
    constructor() {
        super(DefaultWordsReply);
    }

    protected _process(message: DefaultWordsReply): void {
        message.show = '搜索视频、番剧或up主';
        message.word = '';
        message.goto = '';
        message.value = '';
        message.uri = '';
    }
}

/**
 * @deprecated
 */
export class ModeStatusReplyHandler extends BilibiliResponseHandler<ModeStatusReply> {
    constructor() {
        super(ModeStatusReply);
    }

    protected _process(message: ModeStatusReply): void {
        const teenagersModel = message.userModels.find(item => item.mode === 'teenagers');
        if (teenagersModel?.policy?.interval && teenagersModel.policy.interval !== '0') {
            teenagersModel.policy.interval = '0';
        }
    }
}

export class PlayViewUniteReplyHandler extends BilibiliResponseHandler<PlayViewUniteReply> {
    constructor() {
        super(PlayViewUniteReply);
    }

    protected _process(message: PlayViewUniteReply): void {
        delete message.viewInfo?.promptBar;
        if (message.playArcConf?.arcConfs) {
            Object.values(message.playArcConf.arcConfs).forEach(item => {
                if (item.isSupport && item.disabled) {
                    item.disabled = false;
                    item.extraContent = undefined;
                    item.unsupportScene.length = 0;
                }
            });
        }
    }
}

export class PlayViewReplyHandler extends BilibiliResponseHandler<PlayViewReply> {
    constructor() {
        super(PlayViewReply);
    }

    protected _process(message: PlayViewReply): void {
        const { backgroundPlayConf, castConf } = message.playArc || {};
        [backgroundPlayConf, castConf].forEach(arcConf => {
            if (arcConf && (!arcConf.isSupport || arcConf.disabled)) {
                arcConf.isSupport = true;
                arcConf.disabled = false;
                arcConf.extraContent = undefined;
                arcConf.unsupportScene.length = 0;
            }
        });
    }
}

export class PopularReplyHandler extends BilibiliResponseHandler<PopularReply> {
    constructor() {
        super(PopularReply);
    }

    protected _process(message: PopularReply): void {
        message.items = message.items.filter(item => {
            if (item.item.oneofKind === 'smallCoverV5') {
                const card = item.item.smallCoverV5;
                return card.base?.fromType === 'recommend' && !card.base.adInfo.length;
            }
            return !['rcmdOneItem', 'smallCoverV5Ad', 'topicList'].includes(item.item.oneofKind as string);
        });
    }
}

/**
 * @deprecated
 */
export class TFInfoReplyHandler extends BilibiliResponseHandler<TFInfoReply> {
    constructor() {
        super(TFInfoReply);
    }

    protected _process(message: TFInfoReply): void {
        if (message.tipsId !== '0') {
            delete message.tfToast;
            delete message.tfPanelCustomized;
        }
    }
}

export class IpadViewReplyHandler extends BilibiliResponseHandler<IpadViewReply> {
    constructor() {
        super(IpadViewReply);
    }

    protected _process(message: IpadViewReply): void {
        delete message.label;
        delete message.cmIpad;
        delete message.cmConfig;
        delete message.reqUser?.elecPlusBtn;
        message.cms.length = 0;
        message.specialCellNew.length = 0;
        message.relates = message.relates.filter(item => !item.cm.length);
    }
}

export class IpadViewProgressReplyHandler extends BilibiliResponseHandler<IpadViewProgressReply> {
    static processChronos(chronos: Chronos): void {
        let processedMd5 = this.chronosMd5Map[chronos.md5];
        if (!processedMd5) {
            $.warn(
                `MD5 mismatch detected. Received: ${chronos.md5}; File: ${chronos.file}`,
                'Please update the app or script to the latest version. If you are already using the latest version, please contact the author for adjustments'
            );
            processedMd5 = this.chronosMd5Map[getAppEdition()];
        }
        chronos.md5 = processedMd5;
        chronos.file = `https://raw.githubusercontent.com/kokoryh/chronos/refs/heads/master/${processedMd5}.zip`;
        delete chronos.sign;
    }

    static chronosMd5Map = {
        universal: 'ecca73e42e160074e0caf4b3ddb54a52',
        hd: '932002070dc1b51241198a074d2279fc',
        inter: '8c3feda2e92bf60e8a7aeade1a231586',
        c29bd8f2b64a8f57f49c3622c0f763db: 'ecca73e42e160074e0caf4b3ddb54a52', // universal 3.6.4
        '8232ffb6ee43b687b5fe5add5b3e97de': 'feaca416bbc1174b8e935cf87ff8f0b5', // hd 3.6.3
        '325e7073ffc6fb5263682fecdcd1058f': '932002070dc1b51241198a074d2279fc', // hd 2.7.4
        '3a14beddd23328eaddfe9f0eb048d713': '8c3feda2e92bf60e8a7aeade1a231586', // inter 2.7.3
    };

    constructor() {
        super(IpadViewProgressReply);
    }

    protected _process(message: IpadViewProgressReply): void {
        delete message.videoGuide;
        if (this.isAirborneEnabled() && message.chronos) {
            IpadViewProgressReplyHandler.processChronos(message.chronos);
        }
    }
}

export class RelatesFeedReplyHandler extends BilibiliResponseHandler<RelatesFeedReply> {
    static filterRelateCard = (card: RelateCard) => {
        return (
            !this.filterRelateCardType.includes(card.relateCardType) &&
            !card.cmStock.length &&
            !card.basicInfo?.uniqueId
        );
    };

    static filterRelateCardType = [
        RelateCardType.GAME,
        RelateCardType.CM_TYPE,
        RelateCardType.LIVE,
        RelateCardType.AI_RECOMMEND,
        RelateCardType.COURSE,
    ];

    constructor() {
        super(RelatesFeedReply);
    }

    protected _process(message: RelatesFeedReply): void {
        message.relates = message.relates.filter(RelatesFeedReplyHandler.filterRelateCard);
    }
}

export class ViewReplyHandler extends BilibiliResponseHandler<ViewReply> {
    constructor() {
        super(ViewReply);
    }

    protected _process(message: ViewReply): void {
        delete message.cm;
        delete message.reqUser?.elecPlusBtn;
        message.tab?.tabModule.forEach(tabModule => {
            if (tabModule.tab.oneofKind !== 'introduction') return;

            tabModule.tab.introduction.modules = tabModule.tab.introduction.modules.reduce(
                (modules: Module[], module) => {
                    if (
                        [
                            ModuleType.ACTIVITY,
                            ModuleType.PAY_BAR,
                            ModuleType.SPECIALTAG,
                            ModuleType.MERCHANDISE,
                        ].includes(module.type)
                    ) {
                        return modules;
                    }
                    if (module.type === ModuleType.UGC_HEADLINE && module.data.oneofKind === 'headLine') {
                        delete module.data.headLine.label;
                    } else if (module.type === ModuleType.RELATED_RECOMMEND && module.data.oneofKind === 'relates') {
                        module.data.relates.cards = module.data.relates.cards.filter(
                            RelatesFeedReplyHandler.filterRelateCard
                        );
                    }
                    modules.push(module);
                    return modules;
                },
                []
            );
        });
    }
}

export class ViewProgressReplyHandler extends BilibiliResponseHandler<ViewProgressReply> {
    constructor() {
        super(ViewProgressReply);
    }

    protected _process(message: ViewProgressReply): void {
        delete message.dm;
        if (this.isAirborneEnabled() && message.chronos) {
            IpadViewProgressReplyHandler.processChronos(message.chronos);
        }
    }
}

export class DmViewReplyHandler extends BilibiliResponseHandler<DmViewReply> {
    constructor() {
        super(DmViewReply);
    }

    protected _process(message: DmViewReply): void {
        message.activityMeta.length = 0;
        if (message.command?.commandDms.length) {
            message.command.commandDms.length = 0;
        }
    }
}

export class MainListReplyHandler extends BilibiliResponseHandler<MainListReply> {
    constructor() {
        super(MainListReply);
    }

    protected _process(message: MainListReply): void {
        const { purifyTopReplies } = this.options;
        delete message.cm;
        message.subjectTopCards = message.subjectTopCards.filter(item => item.type !== Type.CM);
        if (purifyTopReplies) {
            const pattern = /https:\/\/b23\.tv\/(cm|mall)/;
            message.topReplies = message.topReplies.filter(reply => {
                const urls = reply.content?.urls || {};
                const message = reply.content?.message || '';
                return !Object.keys(urls).some(url => pattern.test(url)) && !pattern.test(message);
            });
        }
    }
}

export class IpadPlayViewReplyHandler extends BilibiliResponseHandler<IpadPlayViewReply> {
    constructor() {
        super(IpadPlayViewReply);
    }

    protected _process(message: IpadPlayViewReply): void {
        delete message.viewInfo?.tryWatchPromptBar;
        if (message.playExtConf?.castTips) {
            message.playExtConf.castTips = { code: 0, message: '' };
        }
    }
}

export class SearchAllResponseHandler extends BilibiliResponseHandler<SearchAllResponse> {
    constructor() {
        super(SearchAllResponse);
    }

    protected _process(message: SearchAllResponse): void {
        message.item = message.item.filter(item => !/_ad_?/.test(item.linktype));
    }
}
