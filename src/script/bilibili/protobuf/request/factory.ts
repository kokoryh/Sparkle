import { DmSegMobileReqHandler, PlayViewUniteReqHandler } from './handler';

const handlers = {
    '/DmSegMobile': DmSegMobileReqHandler,
    '/PlayViewUnite': PlayViewUniteReqHandler,
};

export function createHandler(url: string): InstanceType<(typeof handlers)[keyof typeof handlers]> | null {
    for (const [path, handlerClass] of Object.entries(handlers)) {
        if (url.endsWith(path)) {
            return new handlerClass();
        }
    }
    return null;
}
