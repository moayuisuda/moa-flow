var arrayMove = function (arr, oldIndex, newIndex) {
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
};
var findIndex = function (arr, target) {
    var curr;
    for (var i = 0; i < arr.length; i++) {
        curr = arr[i];
        if (curr === target)
            return i;
    }
    return undefined;
};
var isRectsInterSect = function (boundsA, boundsB) {
    return !(boundsA.x + boundsA.width < boundsB.x ||
        boundsA.x > boundsB.x + boundsB.width ||
        boundsA.y + boundsA.height < boundsB.y ||
        boundsA.y > boundsB.y + boundsB.height);
};
var isVector2d = function (source) {
    return typeof source !== 'string';
};

export { arrayMove, findIndex, isRectsInterSect, isVector2d };
