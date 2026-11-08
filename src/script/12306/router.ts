import { matchUrlSuffix, Router } from '@core/router';
import { doneFakeResponse } from '@core/middleware';
import { abort, exit } from '@core/process';

const router = new Router({
    matchPath: matchUrlSuffix,
});

router.post('/getAdList', doneFakeResponse, ctx => {
    const message = JSON.parse(ctx.request.body);
    ctx.response.body = ((placementNo: string) => {
        if (placementNo === '0007') {
            return '{"materialsList":[{"billMaterialsId":"1","filePath":"#","creativeType":1}],"advertParam":{"skipTime":1}}';
        }
        if (placementNo === 'G0054') {
            return '{"code":"00","materialsList":[{}]}';
        }
        return '{"code":"00","message":"0"}';
    })(message.placementNo);
});

router.post('/mgw.htm', ctx => {
    const excludeTypes = ['com.cars.otsmobile.newHomePageBussData'];
    const operationType = ctx.request.headers['operation-type'] || '';
    excludeTypes.includes(operationType) ? abort() : exit();
});

export { router };
