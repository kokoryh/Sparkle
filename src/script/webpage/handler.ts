import { Middleware } from '@core/middleware';

export interface HTMLState {
    message: Document;
    injectScript?: string;
    injectStyle?: string;
    nodeFilters?: Array<{ selector: string; predicate: (element: HTMLElement) => boolean }>;
}

export const handleHTMLMessage: Middleware = (ctx, next) => {
    const { message, nodeFilters, injectScript, injectStyle } = ctx.state as HTMLState;

    if (nodeFilters) {
        nodeFilters.forEach(({ selector, predicate }) => {
            remove(query(message, selector).filter(predicate));
        });
    }

    if (injectScript) {
        const scriptElement = message.createElement('script');
        scriptElement.textContent = injectScript;
        append(message.head, scriptElement);
    }

    if (injectStyle) {
        const styleElement = message.createElement('style');
        styleElement.textContent = injectStyle;
        append(message.head, styleElement);
    }

    return next();
};

function query<K extends keyof HTMLElementTagNameMap>(
    document: Document,
    selector: string
): HTMLElementTagNameMap[K][] {
    return Array.from(document.querySelectorAll(selector));
}

function append(node: Node, ...childNodes: ChildNode[]): Node[] {
    return childNodes.map(childNode => node.appendChild(childNode));
}

function remove(nodes: Node[]): (Node | undefined)[] {
    return nodes.map(node => node.parentElement?.removeChild(node));
}
