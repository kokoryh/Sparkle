import {
    AccountInfoHandler,
    AccountMineHandler,
    FeedIndexHandler,
    FeedIndexStoryHandler,
    LayoutHandler,
    SplashHandler,
} from './handler';

const handlers = {
    '/show/tab/v2': LayoutHandler,
    '/splash/list': SplashHandler,
    '/splash/show': SplashHandler,
    '/splash/event/list2': SplashHandler,
    '/feed/index': FeedIndexHandler,
    '/feed/index/story': FeedIndexStoryHandler,
    '/account/mine': AccountMineHandler,
    '/account/mine/ipad': AccountMineHandler,
    '/account/myinfo': AccountInfoHandler,
};

export function createHandler(url: string): InstanceType<(typeof handlers)[keyof typeof handlers]> | null {
    for (const [path, handlerClass] of Object.entries(handlers)) {
        if (url.endsWith(path)) {
            return new handlerClass();
        }
    }
    return null;
}
