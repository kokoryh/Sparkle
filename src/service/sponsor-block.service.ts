import { ctx } from '@core/context';
import { FetchResponse } from '@/types/context';

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

export function getSkipSegments(videoId: string, cid = ''): Promise<FetchResponse> {
    cid = cid !== '0' ? cid : '';
    return ctx.fetch({
        method: 'get',
        url: `https://bsbsb.top/api/skipSegments?videoID=${videoId}&cid=${cid}&category=sponsor`,
        headers: {
            origin: 'https://github.com/kokoryh/Sparkle/blob/master/release/surge/module/bilibili.sgmodule',
            'x-ext-version': '1.0.0',
        },
        timeout: 5,
    });
}
