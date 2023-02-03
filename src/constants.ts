import { StageEventName, WindowEventName } from "typings/common"

export const STAGE_ID = 'flow-stage'
export const STAGE_DRAGGING = 'flow-stage--dragging'
export const EVT_LEFTCLICK = 0
export const EVT_RIGHTCLICK = 2

export const COMMON_RESERVED_WORDS = [
    'id', 'cellType'
]

export const RESERVED_WORDS = [
    ...COMMON_RESERVED_WORDS, 'component', 'parent', 'x', 'y', 'ports'
]

export const PORT_RESERVED_WORDS = [
    ...COMMON_RESERVED_WORDS, 'host'
]

export const EDGE_RESERVED_WORDS = [
    ...COMMON_RESERVED_WORDS, 'component', "source", "target",
]

export const STAGE_EVENT_NAMES: StageEventName[] = ['onMouseDown', 'onMouseMove', 'onWheel', 'onClick', 'onMouseUp']
export const WINDOW_EVENT_NAMES: WindowEventName[] = ['onKeyDown', 'onKeyUp']
export const EVENT_NAMES = [...STAGE_EVENT_NAMES, ...WINDOW_EVENT_NAMES, 'init']