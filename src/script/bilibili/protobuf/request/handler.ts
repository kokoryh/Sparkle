import { MessageType } from '@protobuf-ts/runtime';
import { getSkipSegments } from '@core/service/sponsor-block.service';
import {
    DanmakuElem,
    DmColorfulType,
    DmSegMobileReply,
    DmSegMobileReq,
} from '@proto/bilibili/community/service/dm/v1/dm';
import { PlayViewUniteReply, PlayViewUniteReq } from '@proto/bilibili/app/playerunite/v1/player';
import { PGCAnyModel } from '@proto/bilibili/app/playerunite/pgcanymodel/pgcanymodel';
import { BizType, ConfType } from '@proto/bilibili/playershared/playershared';
import { ClipInfo, ClipType } from '@proto/bilibili/pgc/gateway/player/v2/playurl';
import { SegmentItem } from '@entity/bilibili';
import { HttpHeaders } from 'src/types/common';
import { FetchResponse } from 'src/types/client';
import { avToBv } from '@util/bilibili';
import { $, BilibiliProtobufHandler } from '../base';

export abstract class BilibiliRequestHandler<T extends object> extends BilibiliProtobufHandler<T> {
    protected headers: HttpHeaders = {};

    protected body!: Uint8Array;

    protected abstract process(): Promise<void>;

    constructor(type: MessageType<T>) {
        super(type, $.request.bodyBytes!);
    }

    async done(): Promise<void> {
        await this.process();
        $.done({
            response: {
                headers: this.headers,
                body: this.toRawBody(this.body),
            },
        });
    }

    protected fetchRequest(): Promise<FetchResponse> {
        const { url, headers, bodyBytes } = $.request;
        return $.fetch({
            method: 'post',
            url,
            headers,
            body: bodyBytes,
        });
    }

    protected async getSkipSegments(videoId: string, cid = ''): Promise<number[][]> {
        try {
            const response = await getSkipSegments($, videoId, cid);
            if (response.status !== 200) {
                return [];
            }
            const body: SegmentItem[] = JSON.parse(response.body as string);
            return body.reduce((result: number[][], item) => {
                if (item.actionType === 'skip') {
                    result.push(item.segment);
                }
                return result;
            }, []);
        } catch (e) {
            $.error(e);
            return [];
        }
    }
}

export class DmSegMobileReqHandler extends BilibiliRequestHandler<DmSegMobileReq> {
    constructor() {
        super(DmSegMobileReq);
    }

    async process(): Promise<void> {
        const { pid, oid } = this.message;
        const videoId = avToBv(pid);
        $.debug(videoId);
        try {
            const [{ headers, bodyBytes }, segments] = await Promise.all([
                this.fetchRequest(),
                this.getSkipSegments(videoId, oid),
            ]);
            this.headers = headers;
            this.body = new DmSegMobileReplyHandler(bodyBytes!, segments).done();
            if (segments.length) {
                $.info(videoId, segments);
            }
        } catch (e) {
            $.error(e);
            $.exit();
        }
    }
}

export class DmSegMobileReplyHandler extends BilibiliProtobufHandler<DmSegMobileReply> {
    private segments: number[][];

    constructor(data: Uint8Array, segments: number[][]) {
        super(DmSegMobileReply, data);
        this.segments = segments;
    }

    done(): Uint8Array {
        this.process();
        return this.toBinary();
    }

    protected process(): void {
        const message = this.message;
        message.elems = message.elems.filter(item => !item.action?.startsWith('airborne'));
        if (this.segments.length) {
            message.elems.unshift(...this.getAirBorneDms());
        }
    }

    private getAirBorneDms(): DanmakuElem[] {
        const offset = this.isHD() ? 1000 : 2000;
        return this.segments.reduce((result: DanmakuElem[], segment, index) => {
            if (segment[1] - segment[0] < 8) {
                return result;
            }
            const id = (index + 1).toString();
            const start = Math.floor(segment[0] * 1000) + offset;
            const end = Math.floor(segment[1] * 1000);
            result.push({
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
            });
            return result;
        }, []);
    }
}

export class PlayViewUniteReqHandler extends BilibiliRequestHandler<PlayViewUniteReq> {
    constructor() {
        super(PlayViewUniteReq);
    }

    async process(): Promise<void> {
        const { vod, bvid } = this.message;
        const { aid, cid } = vod || {};
        const videoId = bvid || avToBv(aid!);
        try {
            const [{ headers, bodyBytes }, segments] = await Promise.all([
                this.fetchRequest(),
                this.getSkipSegments(videoId, cid),
            ]);
            this.headers = headers;
            this.body = new PlayViewUniteReplyHandler(bodyBytes!, segments).done();
            if (segments.length) {
                $.info(videoId, segments);
            }
        } catch {
            $.exit();
        }
    }
}

export class PlayViewUniteReplyHandler extends BilibiliProtobufHandler<PlayViewUniteReply> {
    private segments: number[][];

    constructor(data: Uint8Array, segments: number[][]) {
        super(PlayViewUniteReply, data);
        this.segments = segments;
    }

    done(): Uint8Array {
        this.process();
        return this.toBinary();
    }

    protected process(): void {
        const message = this.message;
        delete message.viewInfo?.promptBar;
        if (!this.segments.length && message.playArcConf?.arcConfs) {
            Object.values(message.playArcConf.arcConfs).forEach(item => {
                if (item.isSupport && item.disabled) {
                    item.disabled = false;
                    item.extraContent = undefined;
                    item.unsupportScene.length = 0;
                }
            });
        }
        if (this.segments.length) {
            const arcConfs = message.playArcConf?.arcConfs || {};
            [ConfType.SKIPOPED].forEach(i => {
                arcConfs[i] = {
                    isSupport: true,
                    disabled: false,
                    unsupportScene: [],
                };
            });
            [ConfType.FREYAENTER, ConfType.FREYAFULLENTER].forEach(i => {
                arcConfs[i] = {
                    isSupport: false,
                    disabled: true,
                    unsupportScene: [],
                };
            });
            if (message.vodInfo) {
                message.vodInfo.streamList.forEach(item => {
                    delete item.streamInfo?.needVip;
                });
            }
            if (message.playArc) {
                message.playArc.videoType = BizType.PGC;
            }
            message.supplement = {
                typeUrl: 'type.googleapis.com/bilibili.app.playerunite.pgcanymodel.PGCAnyModel',
                value: PGCAnyModel.toBinary(this.getPGCAnyModel()),
            };
        }
    }

    private getPGCAnyModel(): PGCAnyModel {
        return {
            business: {
                clipInfo: this.getClipInfo(),
                vipStatus: 1,
                episodeInfo: {
                    epId: 1231523,
                    cid: '27730904912',
                    aid: '113740078909891',
                    epStatus: '2',
                    seasonInfo: {
                        seasonId: 73081,
                        seasonType: 1,
                        seasonStatus: 13,
                        mode: 2,
                    },
                },
                userStatus: {
                    watchProgress: {
                        lastEpId: 1231523,
                        lastEpIndex: 'OP',
                        progress: '1',
                        lastPlayAid: '113740078909891',
                        lastPlayCid: '27730904912',
                    },
                },
            },
            playExtConf: {
                allowCloseSubtitle: true,
            },
        };
    }

    private getClipInfo(): ClipInfo[] {
        return this.segments.map(([start, end]) => ({
            start: Math.floor(start),
            end: Math.ceil(end),
            clipType: ClipType.CLIP_TYPE_OP,
        }));
    }
}
