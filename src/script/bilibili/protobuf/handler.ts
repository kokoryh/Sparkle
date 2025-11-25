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
import {
    DanmakuElem,
    DmColorfulType,
    DmSegMobileReply,
    DmSegMobileReq,
    DmViewReply,
} from '@proto/bilibili/community/service/dm/v1/dm';
import { MainListReply, Type } from '@proto/bilibili/main/community/reply/v1/reply';
import { PlayViewReply as IpadPlayViewReply } from '@proto/bilibili/pgc/gateway/player/v2/playurl.js';
import { SearchAllResponse } from '@proto/bilibili/polymer/app/search/v1/search';
import { Context } from '@core/context';
import { Middleware } from '@core/middleware';
import { SegmentItem } from '@service/sponsor-block.service';
import { getDevice } from '@utils/index';
import { avToBv } from '@utils/bilibili';
import { Argument } from './middleware';

export const handleDynAllReply: Middleware = async (ctx, next) => {
    const { displayUpList } = ctx.argument as Argument;
    const message = DynAllReply.fromBinary(ctx.response.bodyBytes);
    delete message.topicList;
    if (message.dynamicList) {
        const excludeTypes = [DynamicType.AD, DynamicType.LIVE_RCMD];
        message.dynamicList.list = message.dynamicList.list.filter(item => !excludeTypes.includes(item.cardType));
    }
    handleUpList(message, displayUpList);
    ctx.response.bodyBytes = DynAllReply.toBinary(message);
    return next();
};

function handleUpList(message: DynAllReply, displayUpList: string): void {
    if (displayUpList === 'show' || getDevice().startsWith('iPad')) {
        return;
    }
    if (displayUpList === 'hide' || !message.upList?.showLiveNum) {
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

export const handleDefaultWordsReply: Middleware = async (ctx, next) => {
    const message = DefaultWordsReply.fromBinary(ctx.response.bodyBytes);
    message.show = '搜索视频、番剧或up主';
    message.word = '';
    message.goto = '';
    message.value = '';
    message.uri = '';
    ctx.response.bodyBytes = DefaultWordsReply.toBinary(message);
    return next();
};

export const handleModeStatusReply: Middleware = async (ctx, next) => {
    const message = ModeStatusReply.fromBinary(ctx.response.bodyBytes);
    const teenagersModel = message.userModels.find(item => item.mode === 'teenagers');
    if (teenagersModel?.policy?.interval && teenagersModel.policy.interval !== '0') {
        teenagersModel.policy.interval = '0';
    }
    ctx.response.bodyBytes = ModeStatusReply.toBinary(message);
    return next();
};

export const handlePlayViewUniteReply: Middleware = async (ctx, next) => {
    const message = PlayViewUniteReply.fromBinary(ctx.response.bodyBytes);
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
    ctx.response.bodyBytes = PlayViewUniteReply.toBinary(message);
    return next();
};

export const handlePlayViewReply: Middleware = async (ctx, next) => {
    const message = PlayViewReply.fromBinary(ctx.response.bodyBytes);
    const { backgroundPlayConf, castConf } = message.playArc || {};
    [backgroundPlayConf, castConf].forEach(arcConf => {
        if (arcConf && (!arcConf.isSupport || arcConf.disabled)) {
            arcConf.isSupport = true;
            arcConf.disabled = false;
            arcConf.extraContent = undefined;
            arcConf.unsupportScene.length = 0;
        }
    });
    ctx.response.bodyBytes = PlayViewReply.toBinary(message);
    return next();
};

export const handlePopularReply: Middleware = async (ctx, next) => {
    const message = PopularReply.fromBinary(ctx.response.bodyBytes);
    const excludeTypes = ['rcmdOneItem', 'smallCoverV5Ad', 'topicList'];
    message.items = message.items.filter(item => {
        if (item.item.oneofKind === 'smallCoverV5') {
            const card = item.item.smallCoverV5;
            return card.base?.fromType === 'recommend' && !card.base.adInfo.length;
        }
        return !excludeTypes.includes(item.item.oneofKind as string);
    });
    ctx.response.bodyBytes = PopularReply.toBinary(message);
    return next();
};

export const handleTFInfoReply: Middleware = async (ctx, next) => {
    const message = TFInfoReply.fromBinary(ctx.response.bodyBytes);
    if (message.tipsId !== '0') {
        delete message.tfToast;
        delete message.tfPanelCustomized;
    }
    ctx.response.bodyBytes = TFInfoReply.toBinary(message);
    return next();
};

export const handleIpadViewReply: Middleware = async (ctx, next) => {
    const message = IpadViewReply.fromBinary(ctx.response.bodyBytes);
    delete message.label;
    delete message.cmIpad;
    delete message.cmConfig;
    delete message.reqUser?.elecPlusBtn;
    message.cms.length = 0;
    message.specialCellNew.length = 0;
    message.relates = message.relates.filter(item => !item.cm.length);
    ctx.response.bodyBytes = IpadViewReply.toBinary(message);
    return next();
};

export const handleIpadViewProgressReply: Middleware = async (ctx, next) => {
    const { sponsorBlock } = ctx.argument as Argument;
    const message = IpadViewProgressReply.fromBinary(ctx.response.bodyBytes);
    delete message.videoGuide;
    if (isSponserBlockEnabled(sponsorBlock) && message.chronos) {
        handleChronos(message.chronos, ctx);
    }
    ctx.response.bodyBytes = IpadViewProgressReply.toBinary(message);
    return next();
};

export const handleViewProgressReply: Middleware = async (ctx, next) => {
    const { sponsorBlock } = ctx.argument as Argument;
    const message = ViewProgressReply.fromBinary(ctx.response.bodyBytes);
    delete message.dm;
    if (isSponserBlockEnabled(sponsorBlock) && message.chronos) {
        handleChronos(message.chronos, ctx);
    }
    ctx.response.bodyBytes = ViewProgressReply.toBinary(message);
    return next();
};

function isSponserBlockEnabled(value: string | boolean): boolean {
    return Boolean(value && value !== '#');
}

function handleChronos(chronos: Chronos, ctx: Context): void {
    const chronosMd5Map = getChronosMd5Map();
    let processedMd5 = chronosMd5Map[chronos.md5];
    if (!processedMd5) {
        processedMd5 = chronosMd5Map[getEdition(ctx.request.headers)];
        ctx.warn(
            `MD5 mismatch detected. Received: ${chronos.md5}; File: ${chronos.file}.`,
            'Please update the app or script to the latest version.',
            'If you are already using the latest version, please contact the author for adjustments.'
        );
    }
    chronos.md5 = processedMd5;
    chronos.file = `https://raw.githubusercontent.com/kokoryh/chronos/refs/heads/master/${processedMd5}.zip`;
    delete chronos.sign;
}

function getChronosMd5Map(): Record<string, string> {
    return {
        universal: '9c65f59c76b1653b3605fa61b85c1436',
        hd: '932002070dc1b51241198a074d2279fc',
        inter: '8c3feda2e92bf60e8a7aeade1a231586',
        a18e503ae25c92c45f01b61eefd83ed1: '9c65f59c76b1653b3605fa61b85c1436', // universal 3.8.1
        c29bd8f2b64a8f57f49c3622c0f763db: 'ecca73e42e160074e0caf4b3ddb54a52', // universal 3.6.4
        '8232ffb6ee43b687b5fe5add5b3e97de': 'feaca416bbc1174b8e935cf87ff8f0b5', // hd 3.6.3
        '325e7073ffc6fb5263682fecdcd1058f': '932002070dc1b51241198a074d2279fc', // hd 2.7.4
        '3a14beddd23328eaddfe9f0eb048d713': '8c3feda2e92bf60e8a7aeade1a231586', // inter 2.7.3
    };
}

function getEdition(headers: Record<string, string>): string {
    const ua = headers['user-agent'] || headers['User-Agent'] || '';
    let edition = 'universal';
    if (ua.startsWith('bili-hd')) {
        edition = 'hd';
    } else if (ua.startsWith('bili-inter')) {
        edition = 'inter';
    }
    return edition;
}

export const handleRelatesFeedReply: Middleware = async (ctx, next) => {
    const message = RelatesFeedReply.fromBinary(ctx.response.bodyBytes);
    message.relates = handleRelateCard(message.relates);
    ctx.response.bodyBytes = RelatesFeedReply.toBinary(message);
    return next();
};

export const handleViewReply: Middleware = async (ctx, next) => {
    const message = ViewReply.fromBinary(ctx.response.bodyBytes);
    delete message.cm;
    delete message.reqUser?.elecPlusBtn;
    const excludeTypes = [ModuleType.ACTIVITY, ModuleType.PAY_BAR, ModuleType.SPECIALTAG, ModuleType.MERCHANDISE];
    message.tab?.tabModule.forEach(tabModule => {
        if (tabModule.tab.oneofKind !== 'introduction') return;
        tabModule.tab.introduction.modules = tabModule.tab.introduction.modules.reduce((modules: Module[], module) => {
            if (excludeTypes.includes(module.type)) {
                return modules;
            }
            if (module.type === ModuleType.UGC_HEADLINE && module.data.oneofKind === 'headLine') {
                delete module.data.headLine.label;
            } else if (module.type === ModuleType.RELATED_RECOMMEND && module.data.oneofKind === 'relates') {
                module.data.relates.cards = handleRelateCard(module.data.relates.cards);
            }
            modules.push(module);
            return modules;
        }, []);
    });
    ctx.response.bodyBytes = ViewReply.toBinary(message);
    return next();
};

function handleRelateCard(cards: RelateCard[]): RelateCard[] {
    const excludeTypes = [
        RelateCardType.GAME,
        RelateCardType.CM_TYPE,
        RelateCardType.LIVE,
        RelateCardType.AI_RECOMMEND,
        RelateCardType.COURSE,
    ];
    return cards.filter((card: RelateCard) => {
        return !excludeTypes.includes(card.relateCardType) && !card.cmStock.length && !card.basicInfo?.uniqueId;
    });
}

export const handleDmViewReply: Middleware = async (ctx, next) => {
    const message = DmViewReply.fromBinary(ctx.response.bodyBytes);
    delete message.qoe;
    message.activityMeta.length = 0;
    if (message.command?.commandDms.length) {
        message.command.commandDms.length = 0;
    }
    ctx.response.bodyBytes = DmViewReply.toBinary(message);
    return next();
};

export const handleMainListReply: Middleware = async (ctx, next) => {
    const { purifyComment } = ctx.argument as Argument;
    const message = MainListReply.fromBinary(ctx.response.bodyBytes);
    delete message.cm;
    message.subjectTopCards = message.subjectTopCards.filter(item => item.type !== Type.CM);
    if (purifyComment) {
        const excludePattern = /https:\/\/b23\.tv\/(cm|mall)/;
        message.topReplies = message.topReplies.filter(reply => {
            const urls = reply.content?.urls || {};
            const message = reply.content?.message || '';
            return !Object.keys(urls).some(url => excludePattern.test(url)) && !excludePattern.test(message);
        });
    }
    ctx.response.bodyBytes = MainListReply.toBinary(message);
    return next();
};

export const handleIpadPlayViewReply: Middleware = async (ctx, next) => {
    const message = IpadPlayViewReply.fromBinary(ctx.response.bodyBytes);
    delete message.viewInfo?.tryWatchPromptBar;
    if (message.playExtConf?.castTips) {
        message.playExtConf.castTips = { code: 0, message: '' };
    }
    ctx.response.bodyBytes = IpadPlayViewReply.toBinary(message);
    return next();
};

export const handleSearchAllResponse: Middleware = async (ctx, next) => {
    const message = SearchAllResponse.fromBinary(ctx.response.bodyBytes);
    const excludePattern = /_ad_?/;
    message.item = message.item.filter(item => !excludePattern.test(item.linktype));
    ctx.response.bodyBytes = SearchAllResponse.toBinary(message);
    return next();
};

export const handleRequest: Middleware = async (ctx, next) => {
    const { headers, bodyBytes } = await fetchRequest(ctx);
    Object.assign(ctx.response, { headers, bodyBytes });
    return next();
};

export const handleDmSegMobileReq: Middleware = async (ctx, next) => {
    let body = ctx.request.bodyBytes;
    let data = body[0] ? ctx.ungzip(body.subarray(5)) : body.subarray(5);
    const message = DmSegMobileReq.fromBinary(data);
    if (message.type !== 1) return ctx.exit();
    const { pid, oid } = message;
    const videoId = avToBv(pid);
    const [{ headers, bodyBytes }, segments] = await Promise.all([
        fetchRequest(ctx),
        fetchSponsorBlock(ctx, videoId, oid),
    ]);
    Object.assign(ctx.response, { headers, bodyBytes });
    if (segments.length) {
        ctx.state.segments = segments;
        return next();
    }
};

function fetchRequest(ctx: Context) {
    const { method, url, headers, bodyBytes } = ctx.request;
    return ctx
        .fetch({ method, url, headers, body: bodyBytes, timeout: 3 })
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`Response status code is ${response.status}`);
            }
            if (!response.bodyBytes) {
                throw new Error('Response body is empty');
            }
            return response;
        })
        .catch(e => {
            throw new Error('Failed to request bilibili service', { cause: e });
        });
}

function fetchSponsorBlock(ctx: Context, videoId: string, cid: string): Promise<number[][]> {
    cid = cid !== '0' ? cid : '';
    return ctx
        .fetch({
            method: 'get',
            url: `https://bsbsb.top/api/skipSegments?videoID=${videoId}&cid=${cid}&category=sponsor`,
            headers: {
                origin: 'https://github.com/kokoryh/Sparkle/blob/master/release/surge/module/bilibili.sgmodule',
                'x-ext-version': '1.0.0',
            },
            timeout: 3,
        })
        .then(({ status, body }) => {
            ctx.debug(videoId, status, body);
            if (status !== 200 || !body || body === '[]') {
                return [];
            }
            return (JSON.parse(body) as SegmentItem[]).reduce((memo: number[][], { actionType, segment }) => {
                if (actionType === 'skip' && segment[1] - segment[0] >= 8) {
                    memo.push(segment);
                }
                return memo;
            }, []);
        })
        .catch(e => {
            ctx.error('Failed to request sponsor block service.', e);
            return [];
        });
}

export const handleDmSegMobileReply: Middleware = async (ctx, next) => {
    const message = DmSegMobileReply.fromBinary(ctx.response.bodyBytes);
    message.elems.push(...getAirborneDanmaku(ctx.state.segments));
    ctx.response.bodyBytes = DmSegMobileReply.toBinary(message);
    return next();
};

function getAirborneDanmaku(segments: number[][]): DanmakuElem[] {
    const offset = 2000;
    return segments.map((segment, index) => {
        const id = String(index + 1);
        const start = Math.floor(segment[0] * 1000) + offset;
        const end = Math.floor(segment[1] * 1000);
        return {
            id,
            progress: start,
            mode: 5,
            fontsize: 50,
            color: 16777215,
            midHash: '1948dd5d',
            content: '空指部已就位',
            ctime: '1735660800',
            weight: 11,
            action: `airborne:${end}`,
            pool: 0,
            idStr: id,
            attr: 1310724,
            animation: '',
            extra: '',
            colorful: DmColorfulType.NONE_TYPE,
            type: 1,
            oid: '212364987',
            dmFrom: 1,
        };
    });
}
