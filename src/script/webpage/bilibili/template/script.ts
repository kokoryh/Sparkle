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

function traversal(treeItems: TreeItem[], path: string[] = []): void {
    for (const treeItem of treeItems) {
        const flag = canBeHidden(treeItem.name);
        if (flag) {
            path.push(treeItem.uuid);
        }
        if (needToBeHidden(treeItem)) {
            path.forEach(uuid => uuids.add(uuid));
        }
        for (const slotItem of treeItem.slots ?? []) {
            if (slotItem.children?.length) {
                traversal(slotItem.children, path);
            }
        }
        if (flag) {
            path.pop();
        }
    }
}

function buildStyleContent(uuids: Iterable<string>): string {
    return Array.from(uuids, uuid => `#${uuid}{display:none!important}`).join('');
}

function run(): void {
    const layerTree = (window as any).__BILIACT_EVAPAGEDATA__?.layerTree;
    if (!layerTree) return;
    traversal(layerTree);
    if (!uuids.size) return;
    const styleElement = document.createElement('style');
    styleElement.textContent = buildStyleContent(uuids);
    document.head.appendChild(styleElement);
}

run();
