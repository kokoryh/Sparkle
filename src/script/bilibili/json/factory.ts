import {
    AccountInfoHandler,
    AccountMineHandler,
    FeedIndexHandler,
    FeedIndexStoryHandler,
    LayoutHandler,
    SplashHandler,
} from './handler';

const handlers = {
    '/resource/show/tab/v2?': LayoutHandler,
    '/v2/splash': SplashHandler,
    '/feed/index?': FeedIndexHandler,
    '/feed/index/story?': FeedIndexStoryHandler,
    '/account/mine': AccountMineHandler,
    '/account/myinfo?': AccountInfoHandler,
};

export function createHandler(url: string): InstanceType<(typeof handlers)[keyof typeof handlers]> | null {
    for (const [path, handlerClass] of Object.entries(handlers)) {
        if (url.includes(path)) {
            return new handlerClass();
        }
    }
    return null;
}
