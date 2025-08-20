import { $ } from '@core/env';
import { FetchResponse } from '@/types/client';

export function getSkipSegments(videoId: string, cid = ''): Promise<FetchResponse> {
    cid = cid !== '0' ? cid : '';
    return $.fetch({
        method: 'get',
        url: `https://bsbsb.top/api/skipSegments?videoID=${videoId}&cid=${cid}&category=sponsor`,
        headers: {
            origin: 'https://github.com/kokoryh/Sparkle/blob/master/release/surge/module/bilibili.sgmodule',
            'x-ext-version': '1.0.0',
        },
        timeout: 3,
    });
}
