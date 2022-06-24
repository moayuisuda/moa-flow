import '../node_modules/lodash/lodash.js';
import { l as lodash } from '../_virtual/lodash.js';

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
var remove = function (arr, target) {
    var index = findIndex(arr, target);
    !lodash.exports.isUndefined(index) && arr.splice(index, 1);
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
var callIfFn = function (exp) {
    if (lodash.exports.isFunction(exp))
        return exp();
    else
        return exp;
};

export { arrayMove, callIfFn, findIndex, isRectsInterSect, isVector2d, remove };
