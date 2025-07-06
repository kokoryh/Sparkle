import Client from '@core/client';
import { AbstractMessage, JsonMessage } from '@core/message';
import { AdListReq } from '@entity/12306';

export const $ = Client.getInstance('12306');

export function createHandler(url: string): AdListHandler | MgwHtmHandler | null {
    if (url.endsWith('/getAdList')) {
        return new AdListHandler($.request.body as string);
    } else if (url.endsWith('/mgw.htm')) {
        return new MgwHtmHandler();
    }
    return null;
}

export class AdListHandler extends JsonMessage<AdListReq> {
    done(): void {
        $.done({ response: { body: this.getResponseBody() } });
    }

    private getResponseBody(): string {
        const { placementNo } = this.message;
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

export class MgwHtmHandler extends AbstractMessage {
    private filterList = ['com.cars.otsmobile.newHomePageBussData'];

    done(): void {
        this.isAd() ? $.abort() : $.exit();
    }

    private isAd(): boolean {
        const headers = $.request.headers;
        return this.filterList.includes(headers['operation-type']);
    }
}
