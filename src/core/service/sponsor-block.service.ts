import Client from '@core/client';
import { FetchResponse } from 'src/types/client';

export function getSkipSegments($: Client, videoId: string, cid = ''): Promise<FetchResponse> {
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
