import {
    DynAllReplyMessage,
    DefaultWordsReplyHandler,
    ModeStatusReplyHandler,
    PlayViewUniteReplyHandler,
    PlayViewReplyHandler,
    PopularReplyHandler,
    TFInfoReplyHandler,
    IpadViewReplyHandler,
    IpadViewProgressReplyHandler,
    RelatesFeedReplyHandler,
    ViewReplyHandler,
    ViewProgressReplyHandler,
    DmViewReplyHandler,
    MainListReplyHandler,
    IpadPlayViewReplyHandler,
    SearchAllResponseHandler,
} from './handler';

const handlers = {
    'v2.Dynamic/DynAll': DynAllReplyMessage,
    'v1.Search/DefaultWords': DefaultWordsReplyHandler,
    'v1.Teenagers/ModeStatus': ModeStatusReplyHandler,
    'playerunite.v1.Player/PlayViewUnite': PlayViewUniteReplyHandler,
    'playurl.v1.PlayURL/PlayView': PlayViewReplyHandler,
    'v1.Popular/Index': PopularReplyHandler,
    'view.v1.View/TFInfo': TFInfoReplyHandler,
    'view.v1.View/View': IpadViewReplyHandler,
    'view.v1.View/ViewProgress': IpadViewProgressReplyHandler,
    'viewunite.v1.View/RelatesFeed': RelatesFeedReplyHandler,
    'viewunite.v1.View/View': ViewReplyHandler,
    'viewunite.v1.View/ViewProgress': ViewProgressReplyHandler,
    'v1.DM/DmView': DmViewReplyHandler,
    'v1.Reply/MainList': MainListReplyHandler,
    'v2.PlayURL/PlayView': IpadPlayViewReplyHandler,
    'v1.Search/SearchAll': SearchAllResponseHandler,
};

export function createHandler(url: string): InstanceType<(typeof handlers)[keyof typeof handlers]> | null {
    for (const [path, handlerClass] of Object.entries(handlers)) {
        if (url.endsWith(path)) {
            return new handlerClass();
        }
    }
    return null;
}
