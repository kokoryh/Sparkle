import { modifyBody } from '../../util/utils.js';
import { DynAllReply, DynamicType } from '@proto/bilibili/app/dynamic/v2/dynamic.js';
// import { DefaultWordsReply } from '@proto/bilibili/app/interface/v1/search.js';
// import { ModeStatusReply } from '@proto/bilibili/app/interface/v1/teenagers.js';
import { PlayViewUniteReply } from '@proto/bilibili/app/playerunite/v1/player.js';
import { PlayViewReply } from '@proto/bilibili/app/playurl/v1/playurl.js';
import { PopularReply } from '@proto/bilibili/app/show/popular/v1/popular.js';
import {
    // TFInfoReply,
    ViewReply as IpadViewReply,
    ViewProgressReply as IpadViewProgressReply,
} from '@proto/bilibili/app/view/v1/view.js';
import {
    Module,
    ModuleType,
    RelateCardType,
    RelatesFeedReply,
    ViewReply,
    ViewProgressReply,
} from '@proto/bilibili/app/viewunite/v1/view.js';
import { DmViewReply } from '@proto/bilibili/community/service/dm/v1/dm.js';
import { MainListReply } from '@proto/bilibili/main/community/reply/v1/reply.js';
import { PlayViewReply as IpadPlayViewReply } from '@proto/bilibili/pgc/gateway/player/v2/playurl.js';
import { SearchAllResponse } from '@proto/bilibili/polymer/app/search/v1/search.js';

const emptyBytes = new Uint8Array(0);

export function handleDynAllReply(grpcBody, options) {
    const message = DynAllReply.fromBinary(grpcBody);
    message.topicList = emptyBytes;
    if (message.dynamicList) {
        message.dynamicList.list = message.dynamicList.list.filter(
            item => ![DynamicType.AD, DynamicType.LIVE_RCMD].includes(item.cardType)
        );
    }
    if (options.showUpList === 'false') {
        delete message.upList;
    } else if (!options.isIPad && options.showUpList !== 'true') {
        if (message.upList?.showLiveNum) {
            const { list, listSecond } = message.upList;
            const lastItem = listSecond.at(-1);
            if (lastItem) {
                lastItem.separator = true;
                list.unshift(...listSecond);
                listSecond.length = 0;
            }
        } else {
            delete message.upList;
        }
    }
    modifyBody(DynAllReply, message);
}

// export function handleDefaultWordsReply(grpcBody) {
//     const message = DefaultWordsReply.fromBinary(grpcBody);
//     message.show = '搜索视频、番剧或up主';
//     message.word = '';
//     message.goto = '';
//     message.value = '';
//     message.uri = '';
//     modifyBody(DefaultWordsReply, message);
// }

// export function handleModeStatusReply(grpcBody) {
//     const message = ModeStatusReply.fromBinary(grpcBody);
//     const teenagersModel = message.userModels.find(item => item.mode === 'teenagers');
//     if (teenagersModel?.policy?.interval && teenagersModel.policy.interval !== '0') {
//         teenagersModel.policy.interval = '0';
//         modifyBody(ModeStatusReply, message);
//     }
// }

export function handlePlayViewUniteReply(grpcBody) {
    const message = PlayViewUniteReply.fromBinary(grpcBody);
    if (message.viewInfo) {
        message.viewInfo.promptBar = emptyBytes;
    }
    if (message.playArcConf?.arcConfs) {
        Object.values(message.playArcConf.arcConfs).forEach(item => {
            if (item.isSupport && item.disabled) {
                item.disabled = false;
                item.extraContent = undefined;
                item.unsupportScene.length = 0;
            }
        });
    }
    modifyBody(PlayViewUniteReply, message);
}

export function handlePlayViewReply(grpcBody) {
    const message = PlayViewReply.fromBinary(grpcBody);
    const { backgroundPlayConf, castConf } = message.playArc || {};
    [backgroundPlayConf, castConf].forEach(arcConf => {
        if (arcConf && (!arcConf.isSupport || arcConf.disabled)) {
            arcConf.isSupport = true;
            arcConf.disabled = false;
            arcConf.extraContent = undefined;
            arcConf.unsupportScene.length = 0;
        }
    });
    modifyBody(PlayViewReply, message);
}

export function handlePopularReply(grpcBody) {
    const message = PopularReply.fromBinary(grpcBody);
    message.items = message.items.filter(item => {
        if (item.item.oneofKind === 'smallCoverV5') {
            const card = item.item.smallCoverV5;
            return card.base?.fromType === 'recommend' && !card.base.adInfo.length;
        }
        return !['rcmdOneItem', 'smallCoverV5Ad', 'topicList'].includes(item.item.oneofKind as string);
    });
    modifyBody(PopularReply, message);
}

// export function handleTFInfoReply(grpcBody) {
//     const message = TFInfoReply.fromBinary(grpcBody);
//     if (message.tipsId !== '0') {
//         message.tfToast = emptyBytes;
//         message.tfPanelCustomized = emptyBytes;
//         modifyBody(TFInfoReply, message);
//     }
// }

export function handleIpadViewReply(grpcBody) {
    const message = IpadViewReply.fromBinary(grpcBody);
    message.label = emptyBytes;
    message.cmIpad = emptyBytes;
    message.cmConfig = emptyBytes;
    if (message.reqUser) {
        message.reqUser.elecPlusBtn = emptyBytes;
    }
    message.cms.length = 0;
    message.specialCellNew.length = 0;
    message.relates = message.relates.filter(item => !item.cm.length);
    modifyBody(IpadViewReply, message);
}

export function handleIpadViewProgressReply(grpcBody, { airborneDm }) {
    const message = IpadViewProgressReply.fromBinary(grpcBody);
    message.videoGuide = emptyBytes;
    if (airborneDm && airborneDm !== '#' && message.chronos) {
        message.chronos.md5 = 'f0baed5939c353e14d77eee17b9f266c';
        message.chronos.file = 'https://raw.githubusercontent.com/kokoryh/Sparkle/refs/heads/master/data/chronos.zip';
        delete message.chronos.sign;
    }
    modifyBody(IpadViewProgressReply, message);
}

const filterRelateCardType = [
    RelateCardType.GAME,
    RelateCardType.CM_TYPE,
    RelateCardType.LIVE,
    RelateCardType.AI_RECOMMEND,
    RelateCardType.COURSE,
];

const filterRelateCard = card => {
    return !filterRelateCardType.includes(card.relateCardType) && !card.cmStock.length && !card.basicInfo?.uniqueId;
};

export function handleRelatesFeedReply(grpcBody) {
    const message = RelatesFeedReply.fromBinary(grpcBody);
    message.relates = message.relates.filter(filterRelateCard);
    modifyBody(RelatesFeedReply, message);
}

export function handleViewReply(grpcBody) {
    const message = ViewReply.fromBinary(grpcBody);
    message.cm = emptyBytes;
    if (message.reqUser) {
        message.reqUser.elecPlusBtn = emptyBytes;
    }

    message.tab?.tabModule.forEach(tabModule => {
        if (tabModule.tab.oneofKind !== 'introduction') return;

        tabModule.tab.introduction.modules = tabModule.tab.introduction.modules.reduce((modules: Module[], module) => {
            if (
                [ModuleType.ACTIVITY, ModuleType.PAY_BAR, ModuleType.SPECIALTAG, ModuleType.MERCHANDISE].includes(
                    module.type
                )
            ) {
                return modules;
            }
            if (module.type === ModuleType.UGC_HEADLINE && module.data.oneofKind === 'headLine') {
                module.data.headLine.label = emptyBytes;
            } else if (module.type === ModuleType.RELATED_RECOMMEND && module.data.oneofKind === 'relates') {
                module.data.relates.cards = module.data.relates.cards.filter(filterRelateCard);
            }
            modules.push(module);
            return modules;
        }, []);
    });
    modifyBody(ViewReply, message);
}

export function handleViewProgressReply(grpcBody) {
    const message = ViewProgressReply.fromBinary(grpcBody);
    message.dm = emptyBytes;
    modifyBody(ViewProgressReply, message);
}

export function handleDmViewReply(grpcBody) {
    const message = DmViewReply.fromBinary(grpcBody);
    message.activityMeta.length = 0;
    if (message.command?.commandDms.length) {
        message.command.commandDms.length = 0;
    }
    modifyBody(DmViewReply, message);
}

export function handleMainListReply(grpcBody, options) {
    const message = MainListReply.fromBinary(grpcBody);
    message.cm = emptyBytes;
    if (options.filterTopReplies) {
        const pattern = /https:\/\/b23\.tv\/(cm|mall)/;
        message.topReplies = message.topReplies.filter(reply => {
            const urls = reply.content?.urls || {};
            const message = reply.content?.message || '';
            return !Object.keys(urls).some(url => pattern.test(url)) && !pattern.test(message);
        });
    }
    modifyBody(MainListReply, message);
}

export function handleIpadPlayViewReply(grpcBody) {
    const message = IpadPlayViewReply.fromBinary(grpcBody);
    if (message.viewInfo) {
        message.viewInfo.tryWatchPromptBar = emptyBytes;
    }
    if (message.playExtConf?.castTips) {
        message.playExtConf.castTips = { code: 0, message: '' };
    }
    modifyBody(IpadPlayViewReply, message);
}

export function handleSearchAllResponse(grpcBody) {
    const message = SearchAllResponse.fromBinary(grpcBody);
    message.item = message.item.filter(item => !item.linktype.endsWith('_ad'));
    modifyBody(SearchAllResponse, message);
}
