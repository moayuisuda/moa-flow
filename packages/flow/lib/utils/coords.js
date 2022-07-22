var getRelativeBoundingBox = function (element, container) {
    var curr = element;
    var nodeBox = {
        top: 0,
        left: 0,
        x: 0,
        y: 0,
        width: element.offsetWidth,
        height: element.offsetHeight,
    };
    while (curr) {
        if (curr === container)
            break;
        nodeBox.top += curr.offsetTop;
        nodeBox.left += curr.offsetLeft;
        curr = curr.offsetParent;
    }
    Object.assign(nodeBox, {
        x: nodeBox.left,
        y: nodeBox.top
    });
    return nodeBox;
};

export { getRelativeBoundingBox };
