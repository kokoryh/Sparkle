export function isIPad(): boolean {
    let device = '';
    if (typeof $environment !== 'undefined' && $environment['device-model']) {
        device = $environment['device-model'];
    } else if (typeof $loon !== 'undefined') {
        device = $loon;
    }
    return device.includes('iPad');
}

export function createCaseInsensitiveDictionary<T extends object>(initial: T = {} as T): T & { [key: string]: any } {
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

export function stringify(value: any): string {
    if (typeof value !== 'object' || value === null) {
        return String(value);
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (value instanceof RegExp) {
        return value.toString();
    }
    if (Array.isArray(value)) {
        return JSON.stringify(value);
    }
    if (typeof value.toString === 'function' && value.toString !== Object.prototype.toString) {
        return value.toString();
    }
    return JSON.stringify(value);
}

export function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
