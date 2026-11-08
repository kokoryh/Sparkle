import { VideoPoint } from '@proto/bilibili/app/viewunite/v1/view';
import { SegmentItem } from '@service/sponsor-block.service';

export function toBvid(avid: string | number): string {
    const XOR_CODE = 23442827791579n;
    const MAX_AID = 1n << 51n;
    const BASE = 58n;
    const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';
    const bytes = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
    let bvIndex = bytes.length - 1;
    let tmp = (MAX_AID | BigInt(avid)) ^ XOR_CODE;
    while (tmp > 0) {
        bytes[bvIndex] = data[Number(tmp % BigInt(BASE))];
        tmp = tmp / BASE;
        bvIndex -= 1;
    }
    [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
    [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
    return bytes.join('');
}

export function toAvid(bvid: string): number {
    const XOR_CODE = 23442827791579n;
    const MASK_CODE = 2251799813685247n;
    const BASE = 58n;
    const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';
    const bvidArr = Array.from(bvid);
    [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
    [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
    bvidArr.splice(0, 3);
    const tmp = bvidArr.reduce((pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)), 0n);
    return Number((tmp & MASK_CODE) ^ XOR_CODE);
}

export function parseSegments(body: string, roundBounds: boolean) {
    const items: SegmentItem[] = JSON.parse(body);

    if (items.length === 0) {
        return { segments: [], videoDuration: 0 };
    }

    const videoDuration = Math.floor(items[0].videoDuration) || 0;

    const filtered: [number, number][] = items
        .filter(item => item.actionType === 'skip')
        .map(item => (roundBounds ? [Math.floor(item.segment[0]), Math.ceil(item.segment[1])] : item.segment));

    if (filtered.length <= 1) {
        return { segments: filtered, videoDuration };
    }

    filtered.sort((a, b) => a[0] - b[0]);
    const merged: [number, number][] = [filtered[0]];
    for (let i = 1; i < filtered.length; i++) {
        const curr = filtered[i];
        const last = merged[merged.length - 1];
        if (curr[0] <= last[1]) {
            last[1] = Math.max(last[1], curr[1]);
        } else {
            merged.push(curr);
        }
    }

    return {
        segments: merged.filter(seg => seg[1] - seg[0] >= 5),
        videoDuration,
    };
}

export function createMergedPoints(points: VideoPoint[], segments: number[][], videoDuration: number): VideoPoint[] {
    const result: VideoPoint[] = [];

    if (!isPointsContinuous(points)) {
        points = [];
    }

    let currentTime = 0;
    let pIdx = 0;
    let sIdx = 0;

    while (pIdx < points.length || sIdx < segments.length) {
        if (sIdx < segments.length && currentTime >= segments[sIdx][0]) {
            const [segFrom, segTo] = segments[sIdx];
            if (currentTime >= segTo) {
                sIdx++;
                continue;
            }
            result.push({
                type: 2,
                from: String(Math.max(currentTime, segFrom)),
                to: String(segTo),
                content: '广告',
                cover: '',
            });
            currentTime = segTo;
            sIdx++;
            continue;
        }

        if (pIdx < points.length) {
            const p = points[pIdx];
            const pTo = Number(p.to);

            if (currentTime >= pTo) {
                pIdx++;
                continue;
            }

            if (sIdx < segments.length && segments[sIdx][0] < pTo) {
                const nextSegFrom = segments[sIdx][0];
                if (nextSegFrom > currentTime) {
                    result.push({
                        ...p,
                        from: String(currentTime),
                        to: String(nextSegFrom),
                    });
                    currentTime = nextSegFrom;
                }
            } else {
                result.push({
                    ...p,
                    from: String(currentTime),
                    to: String(pTo),
                });
                currentTime = pTo;
                pIdx++;
            }
        } else {
            const nextSegFrom = segments[sIdx][0];
            if (currentTime < nextSegFrom) {
                result.push({
                    type: 2,
                    from: String(currentTime),
                    to: String(nextSegFrom),
                    content: '正片',
                    cover: '',
                });
                currentTime = nextSegFrom;
            }
        }
    }

    if (points.length === 0 && currentTime < videoDuration) {
        result.push({
            type: 2,
            from: String(currentTime),
            to: String(videoDuration),
            content: '正片',
            cover: '',
        });
    }

    return result;
}

function isPointsContinuous(points: VideoPoint[]): boolean {
    if (points.length === 0) {
        return true;
    }
    if (points[0].from !== '0') {
        return false;
    }
    for (let i = 1; i < points.length; i++) {
        if (points[i - 1].to !== points[i].from) {
            return false;
        }
    }
    return true;
}
