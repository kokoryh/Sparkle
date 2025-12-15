import { matchUrlSuffix, Router } from '@core/router';
import { doneFakeResponse } from '@core/middleware';

const router = new Router({
    matchPath: matchUrlSuffix,
});

router.post('/getAdList', doneFakeResponse, ctx => {
    const getResponseBody = (placementNo: string) => {
        if (placementNo === '0007') {
            return '{"materialsList":[{"billMaterialsId":"1","filePath":"#","creativeType":1}],"advertParam":{"skipTime":1}}';
        }
        if (placementNo === 'G0054') {
            return '{"code":"00","materialsList":[{}]}';
        }
        return '{"code":"00","message":"0"}';
    };

    const message = JSON.parse(ctx.request.body);
    ctx.response.body = getResponseBody(message.placementNo);
});

router.post('/mgw.htm', ctx => {
    const excludeTypes = ['com.cars.otsmobile.newHomePageBussData'];
    const headers = ctx.request.headers;
    const operationType = headers['operation-type'] || headers['Operation-Type'];
    excludeTypes.includes(operationType) ? ctx.abort() : ctx.exit();
});

export default router;
