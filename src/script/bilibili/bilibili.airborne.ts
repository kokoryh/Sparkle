import { PlayViewUniteReply, PlayViewUniteReq } from '@proto/bilibili/app/playerunite/v1/player';
import { PGCAnyModel } from '@proto/bilibili/app/playerunite/pgcanymodel/pgcanymodel';
import { BizType, ConfType } from '@proto/bilibili/playershared/playershared';
import { ClipInfo, ClipType } from '@proto/bilibili/pgc/gateway/player/v2/playurl';
import {
    DanmakuElem,
    DmColorfulType,
    DmSegMobileReply,
    DmSegMobileReq,
} from '@proto/bilibili/community/service/dm/v1/dm';
import { av2bv } from '@util/bilibili';

const url = $request.url;
const device = globalThis.$environment?.['device-model'] || globalThis.$loon;
const isIpad = device?.includes('iPad');
if (url.endsWith('/PlayViewUnite')) {
    handlePlayViewUniteReq($request);
} else if (url.endsWith('/DmSegMobile') && isIpad) {
    handleDmSegMobileReq($request);
} else {
    $done({});
}

function handlePlayViewUniteReq({ url, headers, body }) {
    const binaryBody = getBinaryBody(body);
    const message = PlayViewUniteReq.fromBinary(binaryBody);
    const { vod, bvid } = message;
    const { aid, cid } = vod || {};
    const videoId = bvid || av2bv(aid);
    Promise.all([fetchOriginalRequest(url, headers, body), fetchSponsorBlock(videoId, cid !== '0' ? cid : '')])
        .then(([{ headers, body }, segments]) => {
            $done({ response: { headers, body: newRawBody(handlePlayViewUniteReply(body, segments, videoId)) } });
        })
        .catch(err => {
            console.log(err?.toString());
            $done({});
        });
}

function handleDmSegMobileReq({ url, headers, body }) {
    const binaryBody = getBinaryBody(body);
    const message = DmSegMobileReq.fromBinary(binaryBody);
    const { pid, oid } = message;
    const videoId = av2bv(pid);
    Promise.all([fetchOriginalRequest(url, headers, body), fetchSponsorBlock(videoId, oid !== '0' ? oid : '')])
        .then(([{ headers, body }, segments]) => {
            $done({ response: { headers, body: newRawBody(handleDmSegMobileReply(body, segments, videoId)) } });
        })
        .catch(err => {
            console.log(err?.toString());
            $done({});
        });
}

function fetchOriginalRequest(url, headers, body): Promise<{ headers; body }> {
    const params = {
        url,
        headers,
        body,
        'binary-mode': true,
    };
    return new Promise((resolve, reject) => {
        $httpClient.post(params, (error, response, data) => {
            if (response?.status !== 200) {
                reject('Fetch Original Request Failed');
            } else {
                resolve({
                    headers: response.headers,
                    body: data,
                });
            }
        });
    });
}

function fetchSponsorBlock(videoId, cid): Promise<number[][]> {
    const params = {
        url: `https://bsbsb.top/api/skipSegments?videoID=${videoId}&cid=${cid}&category=sponsor`,
        headers: {
            origin: 'https://github.com/kokoryh/Sparkle/blob/master/release/surge/module/bilibili.sgmodule',
            'x-ext-version': '1.0.0',
        },
    };
    return new Promise(resolve => {
        $httpClient.get(params, (error, response, data) => {
            if (response?.status !== 200) {
                resolve([]);
            } else {
                const body: any[] = JSON.parse(data as string);
                const segments = body.reduce((result, element) => {
                    if (element.actionType === 'skip') {
                        result.push(element.segment);
                    }
                    return result;
                }, []);
                resolve(segments);
            }
        });
    });
}

function handlePlayViewUniteReply(body, segments: number[][], videoId: string) {
    const emptyBytes = new Uint8Array(0);
    const binaryBody = getBinaryBody(body);
    const message = PlayViewUniteReply.fromBinary(binaryBody);
    if (message.viewInfo) {
        message.viewInfo.promptBar = emptyBytes;
    }
    if (!segments.length && message.playArcConf?.arcConfs) {
        Object.values(message.playArcConf.arcConfs).forEach(item => {
            if (item.isSupport && item.disabled) {
                item.disabled = false;
                item.extraContent = undefined;
                item.unsupportScene.length = 0;
            }
        });
    }
    if (segments.length) {
        console.log(`${videoId}: ${JSON.stringify(segments)}`);

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
            value: PGCAnyModel.toBinary(getPGCAnyModel(segments)),
        };
    }
    return PlayViewUniteReply.toBinary(message);
}

function getPGCAnyModel(segments: number[][]): PGCAnyModel {
    return {
        business: {
            clipInfo: getClipInfo(segments),
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

function getClipInfo(segments: number[][]): ClipInfo[] {
    return segments.map(([start, end]) => ({
        start: Math.floor(start),
        end: Math.ceil(end),
        clipType: ClipType.CLIP_TYPE_OP,
    }));
}

function handleDmSegMobileReply(body, segments: number[][], videoId: string) {
    const binaryBody = getBinaryBody(body);
    const message = DmSegMobileReply.fromBinary(binaryBody);
    message.elems = message.elems.filter(item => !item.action?.startsWith('airborne'));
    if (segments.length) {
        console.log(`${videoId}: ${JSON.stringify(segments)}`);
        message.elems.unshift(...getAirBorneDms(segments));
    }
    return DmSegMobileReply.toBinary(message);
}

function getAirBorneDms(segments: number[][]): DanmakuElem[] {
    return segments.map((segment, index) => {
        const id = (index + 1).toString();
        const start = Math.max(Math.floor(segment[0] * 1000), 1);
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

function getBinaryBody(body) {
    const header = body.slice(0, 5);
    let binaryBody = body.slice(5);
    if (header[0]) {
        binaryBody = $utils.ungzip(binaryBody);
    }
    return binaryBody;
}

function newRawBody(body) {
    const checksum = Checksum(body.length);
    const rawBody = new Uint8Array(5 + body.length);

    rawBody[0] = 0; // 直接置protobuf 为未压缩状态
    rawBody.set(checksum, 1); // 1-4位： 校验值(4位)
    rawBody.set(body, 5); // 5-end位：protobuf数据
    return rawBody;
}

function Checksum(num) {
    const arr = new ArrayBuffer(4); // an Int32 takes 4 bytes
    const view = new DataView(arr);
    view.setUint32(0, num, false); // byteOffset = 0; litteEndian = false
    return new Uint8Array(arr);
}
