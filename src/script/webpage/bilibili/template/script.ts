interface TreeItem {
    expand: boolean;
    label: string;
    level: number;
    name: string;
    props?: Props;
    slots: SlotItem[];
    type: string;
    uuid: string;
    version: string;
}

interface SlotItem {
    children?: TreeItem[];
    expand: boolean;
    label: string;
    level: number;
    name: string;
    type: string;
    uuid: string;
}

interface Props {
    jumpAddress?: string;
    list?: Slider[];
}

interface Slider {
    title: string;
    link: string;
    image: {
        url: string;
    };
}

const uuids = new Set<string>();

const hiddenTypeList = ['EvaLayoutContainerPrerender', 'EvaLayoutContainer', 'EvaLinkButton', 'H5Slider'];

function canBeHidden(type: string): boolean {
    return hiddenTypeList.includes(type);
}

function needToBeHidden(item: TreeItem): boolean {
    const jumpAddress = item.props?.jumpAddress;
    const links = item.props?.list?.map(item => item.link) || [];
    return [jumpAddress, ...links].some(url => url && !new URL(url).hostname.includes('bilibili'));
}

function traversalTree(treeItems: TreeItem[], path: string[] = []): void {
    for (const item of treeItems) {
        const flag = canBeHidden(item.name);
        if (flag) {
            path.push(item.uuid);
        }
        if (needToBeHidden(item)) {
            path.forEach(p => uuids.add(p));
        }
        if (item.slots?.length) {
            traversalSlot(item.slots, path);
        }
        if (flag) {
            path.pop();
        }
    }
}

function traversalSlot(slotItems: SlotItem[], path: string[] = []): void {
    for (const item of slotItems) {
        if (item.children?.length) {
            traversalTree(item.children, path);
        }
    }
}

function renderStyle(uuids: string[]): string {
    return uuids.map(id => `#${id}{display:none!important}`).join('');
}

function run(): void {
    const layerTree = (window as any).__BILIACT_EVAPAGEDATA__?.layerTree;
    if (!layerTree) return;
    traversalTree(layerTree);
    const styleElement = document.createElement('style');
    styleElement.textContent = renderStyle(Array.from(uuids));
    document.head.append(styleElement);
}

run();
