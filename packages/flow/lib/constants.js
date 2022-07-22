import { __spreadArray } from './node_modules/tslib/tslib.es6.js';

var STAGE_ID = 'flow-stage';
var EVT_LEFTCLICK = 0;
var EVT_RIGHTCLICK = 2;
var COMMON_RESERVED_WORDS = [
    'id', 'cellType'
];
__spreadArray(__spreadArray([], COMMON_RESERVED_WORDS, true), [
    'component', 'parent', 'x', 'y', 'visible', 'ports'
], false);
__spreadArray(__spreadArray([], COMMON_RESERVED_WORDS, true), [
    'host'
], false);
__spreadArray(__spreadArray([], COMMON_RESERVED_WORDS, true), [
    'component', "source", "target", 'visible',
], false);
var STAGE_EVENT_NAMES = ['onMouseDown', 'onMouseUp', 'onMouseMove', 'onWheel', 'onClick'];
var WINDOW_EVENT_NAMES = ['onKeyDown', 'onKeyUp'];
__spreadArray(__spreadArray(__spreadArray([], STAGE_EVENT_NAMES, true), WINDOW_EVENT_NAMES, true), ['init'], false);

export { COMMON_RESERVED_WORDS, EVT_LEFTCLICK, EVT_RIGHTCLICK, STAGE_EVENT_NAMES, STAGE_ID, WINDOW_EVENT_NAMES };
