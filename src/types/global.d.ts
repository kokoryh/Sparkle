import * as Surge from './surge.d';
import * as Loon from './loon.d';
import * as QuantumultX from './quantumult-x.d';

declare global {
    const $network: Surge.Network;
    const $script: Surge.Script | Loon.Script;
    const $environment: Surge.Environment;
    const $persistentStore: Surge.PersistentStore | Loon.PersistentStore;
    const $httpAPI: Surge.HttpAPI;
    const $httpClient: Surge.HttpClient | Loon.HttpClient;
    const $utils: Surge.Utils | Loon.Utils;
    const $notification: Surge.Notification | Loon.Notification;
    const $request: Surge.HttpRequest | Loon.HttpRequest | QuantumultX.HttpRequest;
    const $response: Surge.HttpResponse | Loon.HttpResponse | QuantumultX.HttpResponse;
    const $done: Surge.Done | Loon.Done | QuantumultX.Done;
    const $argument: string | object | undefined;
    const $loon: string;
    const $task: QuantumultX.Task;
    const $prefs: QuantumultX.Prefs;
    const $notify: QuantumultX.Notify;
}
