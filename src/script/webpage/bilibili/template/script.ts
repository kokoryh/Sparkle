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
}

const uuids = new Set<string>();

const hiddenTypeList = ['EvaLayoutContainer', 'EvaLinkButton'];

function canBeHidden(type: string): boolean {
    return hiddenTypeList.includes(type);
}

function needToBeHidden(item: TreeItem) {
    const jumpAddress = item.props?.jumpAddress;
    if (!jumpAddress) return false;
    return !new URL(jumpAddress).hostname.includes('bilibili');
}

function traversalTree(treeItems: TreeItem[], path: string[] = []) {
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

function traversalSlot(slotItems: SlotItem[], path: string[] = []) {
    for (const item of slotItems) {
        if (item.children?.length) {
            traversalTree(item.children, path);
        }
    }
}

function renderStyle(uuids: string[]) {
    return uuids.map(id => `#${id}{display:none!important}`).join('');
}

const layerTree = (window as any).__BILIACT_EVAPAGEDATA__?.layerTree;
if (layerTree) {
    traversalTree(layerTree);
    const styleElement = document.createElement('style');
    styleElement.textContent = renderStyle(Array.from(uuids));
    document.head.append(styleElement);
}
