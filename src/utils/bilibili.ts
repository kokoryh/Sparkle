import { VideoPoint } from '@proto/bilibili/app/viewunite/v1/view';

// const XOR_CODE = 23442827791579n;
// const MASK_CODE = 2251799813685247n;
// const MAX_AID = 1n << 51n;
// const BASE = 58n;

// const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';

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

export function createMergedPoints(points: VideoPoint[], segments: number[][], videoDuration: number): VideoPoint[] {
    const result: VideoPoint[] = [];

    // 对 segments 进行预处理：向下/向上取整，并按时间先后排序（确保逻辑严谨）
    segments = segments.map(seg => [Math.floor(seg[0]), Math.ceil(seg[1])]).sort((a, b) => a[0] - b[0]);

    let currentTime = 0;
    let pIdx = 0; // points 数组的指针
    let sIdx = 0; // segments 数组的指针

    // 主循环：只要还有未处理的 points 或 segments，就继续推进时间线
    while (pIdx < points.length || sIdx < segments.length) {
        // 如果当前时间正好遇到广告开始
        if (sIdx < segments.length && currentTime === segments[sIdx][0]) {
            const [segFrom, segTo] = segments[sIdx];

            // 插入广告片段
            result.push({
                type: 2,
                from: String(segFrom),
                to: String(segTo),
                content: '广告',
                cover: '',
            });

            // 时间线直接跳到广告结束
            currentTime = segTo;
            sIdx++;
            continue;
        }

        // 如果还有剩余的 points
        if (pIdx < points.length) {
            const p = points[pIdx];
            const pFrom = Number(p.from);
            const pTo = Number(p.to);

            // 如果当前时间落后于当前 point 的开始时间（points 中间有断层）
            if (currentTime < pFrom) {
                // 如果后面还有广告，且广告在 pFrom 之前就触发了
                if (sIdx < segments.length && segments[sIdx][0] < pFrom) {
                    const nextSegFrom = segments[sIdx][0];
                    // 补齐从当前时间到广告开始的空缺（继承默认或前一项）
                    result.push({
                        type: pIdx > 0 ? points[pIdx - 1].type : 2,
                        from: String(currentTime),
                        to: String(nextSegFrom),
                        content: pIdx > 0 ? points[pIdx - 1].content : '正片',
                        cover: pIdx > 0 ? points[pIdx - 1].cover : '',
                    });
                    currentTime = nextSegFrom;
                } else {
                    // 如果后面没有广告，或者广告在 pFrom 之后，直接把时间线拉到 pFrom
                    currentTime = pFrom;
                }
                continue;
            }

            // 如果当前 point 已经被时间线走完了（可能被前面的广告完全覆盖了）
            if (currentTime >= pTo) {
                pIdx++;
                continue;
            }

            // 此时 currentTime 一定在 [pFrom, pTo) 之间
            // 检查在这个 point 结束前，是否有下一个广告会插进来
            if (sIdx < segments.length && segments[sIdx][0] < pTo) {
                const nextSegFrom = segments[sIdx][0];

                // 如果广告开始时间大于当前时间，说明可以裁剪出一段原 point 的残余片段
                if (nextSegFrom > currentTime) {
                    result.push({
                        ...p,
                        from: String(currentTime),
                        to: String(nextSegFrom),
                    });
                    currentTime = nextSegFrom;
                } else {
                    // 如果广告开始时间 <= 当前时间，说明当前时间可以直接进入广告逻辑（下一次循环会走到广告分支）
                    // 此时不需要推进 currentTime，让它在下一次循环由广告分支处理
                }
            } else {
                // 后面没有广告会截断当前 point，直接完整保留或保留剩余部分
                result.push({
                    ...p,
                    from: String(currentTime),
                    to: String(pTo),
                });
                currentTime = pTo;
                pIdx++;
            }
        } else {
            // points 已经全部处理完，但还有剩余广告的情况（例如 points 为空，但有广告）
            if (sIdx < segments.length) {
                const [nextSegFrom] = segments[sIdx];
                if (currentTime < nextSegFrom) {
                    // 补齐到广告开始的片段
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
    }

    // 特殊边界处理：如果最后时间线停下来了，或者是整个数组为空且有广告覆盖后的最终兜底
    if (segments.length > 0) {
        // 只有当最后一段是广告，或者 points 结束时，判断是否需要补齐最后的片段
        const lastSegTo = Math.ceil(segments[segments.length - 1][1]);
        if (currentTime === lastSegTo) {
            result.push({
                type: 2,
                from: String(currentTime),
                to: String(videoDuration),
                content: '正片',
                cover: '',
            });
        }
    }

    return result;
}
