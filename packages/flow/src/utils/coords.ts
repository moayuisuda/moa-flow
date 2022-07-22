export interface BoundingBox {
    left: number;
    top: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export const getRelativeBoundingBox = (element: HTMLElement, container: HTMLElement): BoundingBox => {
    let curr = element;
    const nodeBox = {
        top: 0,
        left: 0,
        x: 0,
        y: 0,
        width: element.offsetWidth,
        height: element.offsetHeight,
    };

    while (curr) {
        if (curr === container) break;

        nodeBox.top += curr.offsetTop;
        nodeBox.left += curr.offsetLeft;

        curr = curr.offsetParent as HTMLElement;
    }

    Object.assign(nodeBox, {
        x: nodeBox.left,
        y: nodeBox.top
    })
    return nodeBox;
}