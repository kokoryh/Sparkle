import { $ } from '@core/env';
import { IMessage } from '@core/message';
import { createCaseInsensitiveDictionary } from '@utils/index';

interface AdListReq {
    placementNo: string;
}

export function createHandler(url: string): AdListHandler | MgwHtmHandler | null {
    if (url.endsWith('/getAdList')) {
        return new AdListHandler();
    } else if (url.endsWith('/mgw.htm')) {
        return new MgwHtmHandler();
    }
    return null;
}

export class AdListHandler implements IMessage {
    done(): void {
        $.done({ response: { body: this.getResponseBody() } });
    }

    private getResponseBody(): string {
        const { placementNo } = JSON.parse($.request.body as string) as AdListReq;
        switch (placementNo) {
            case '0007':
                return '{"materialsList":[{"billMaterialsId":"1","filePath":"#","creativeType":1}],"advertParam":{"skipTime":1}}';
            case 'G0054':
                return '{"code":"00","materialsList":[{}]}';
            default:
                return '{"code":"00","message":"0"}';
        }
    }
}

export class MgwHtmHandler implements IMessage {
    private filterList = ['com.cars.otsmobile.newHomePageBussData'];

    done(): void {
        this.isAd() ? $.abort() : $.exit();
    }

    private isAd(): boolean {
        const headers = createCaseInsensitiveDictionary($.request.headers);
        return this.filterList.includes(headers['operation-type']);
    }
}
