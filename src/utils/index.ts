type CaseInsensitiveDictionary<T> = T & { [key: string]: any };

export function isIPad(): boolean {
    let device = '';
    if (typeof $environment !== 'undefined') {
        device = $environment['device-model'];
    } else if (typeof $loon !== 'undefined') {
        device = $loon;
    }
    return device.includes('iPad');
}

export function createCaseInsensitiveDictionary<T extends object>(initial: T = {} as T): CaseInsensitiveDictionary<T> {
    const target = Object.create(null);
    const normalize = (property: string | symbol) => {
        return typeof property === 'string' ? property.toLowerCase() : property;
    };
    for (const [key, value] of Object.entries(initial)) {
        target[normalize(key)] = value;
    }
    const proxyHandler: ProxyHandler<T> = {
        get(target, property) {
            return Reflect.get(target, normalize(property));
        },
        set(target, property, value) {
            return Reflect.set(target, normalize(property), value);
        },
        has(target, property) {
            return Reflect.has(target, normalize(property));
        },
        deleteProperty(target, property) {
            return Reflect.deleteProperty(target, normalize(property));
        },
        ownKeys(target) {
            return Reflect.ownKeys(target);
        },
        getOwnPropertyDescriptor(target, property) {
            return Reflect.getOwnPropertyDescriptor(target, normalize(property));
        },
        defineProperty(target, property, descriptor) {
            return Reflect.defineProperty(target, normalize(property), descriptor);
        },
    };
    return new Proxy(target, proxyHandler);
}
