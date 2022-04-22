const arrayMove = (arr, oldIndex, newIndex) => {
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
};
const findIndex = (arr, target) => {
    let curr;
    for (let i = 0; i < arr.length; i++) {
        curr = arr[i];
        if (curr === target)
            return i;
    }
    return undefined;
};
const remove = (arr, target) => {
    arr.splice(findIndex(arr, target), 1);
};
const isRectsInterSect = (boundsA, boundsB) => {
    return !(boundsA.x + boundsA.width < boundsB.x ||
        boundsA.x > boundsB.x + boundsB.width ||
        boundsA.y + boundsA.height < boundsB.y ||
        boundsA.y > boundsB.y + boundsB.height);
};
const isVector2d = (source) => {
    return typeof source !== 'string';
};

export { arrayMove, findIndex, isRectsInterSect, isVector2d, remove };
