import Model from "./Model";
import { autorun } from "mobx"
import { without } from 'lodash';
import { NodeDataType } from "./cells/Node";
import { CellDataType, CellModel } from './cells/Cell';
import { EVT_LEFTCLICK, EVT_RIGHTCLICK, STAGE_EVENT_NAMES, WINDOW_EVENT_NAMES } from './constants';
import { BehaviorName, StageEventName, Vector2d, WindowEventName } from "./typings/common";

type StageEventType = React.WheelEvent | React.MouseEvent
interface StageEventFn {
    (e: StageEventType, model: Model): any
}

interface WindowEventFn {
    (e: KeyboardEvent, model: Model): any
}
interface InitFn {
    (model: Model): any
}

const INPUT_NODELIST = ['TEXTAREA', 'INPUT']

type EventMaps = Partial<{
    [key in StageEventName]: StageEventFn
} | {
        [key in WindowEventName]: WindowEventFn
    } | {
        'init': InitFn
    }>

export const behaviorsMap: Record<BehaviorName, EventMaps> = {
    clearState: {
        onMouseDown: (e, model) => {
            if (!model.buffer.select.isSelecting && e.button === EVT_LEFTCLICK)
                model.clearSelect();
        },
        onClick: (e, model) => {
            if (e.button === EVT_LEFTCLICK) {
                model.contextMenuVisible = false
            }
        }
    },
    link: {
        onMouseUp: (e, model) => {
            model.clearLinkBuffer();
        },
        onMouseMove: (e: React.MouseEvent, model) => {
            const {
                buffer: { link },
            } = model;

            if (!link.source) return;
            model.setLinkingPosition(model.getCursorCoord(e));
        }
    },
    select: {
        init: (model) => {
            // 非受控设置select的节点
            let prevSelectCells: string[] = []
            autorun(() => {
                // 上次存在这次不存在的就是需要设置为false的
                const toFalseCells = without(prevSelectCells, ...model.selectCells)
                // 这次存在上次不存在的就是需要设置为true的
                const toTrueCells = without(model.selectCells, ...prevSelectCells)

                console.log(toFalseCells, toTrueCells)
                toFalseCells.forEach(cellId => {
                    const cellModel = model.getCellModel(cellId) as CellModel
                    cellModel && (cellModel.state.isSelect = false)
                })

                toTrueCells.forEach(cellId => {
                    const cellModel = model.getCellModel(cellId) as CellModel
                    console.log(cellModel)
                    cellModel && (cellModel.isSelect = true)
                })

                prevSelectCells = model.selectCells.slice();
            })
        }
    },
    drag: {
        onMouseMove: (e, model) => {
            const { drag, select } = model.buffer
            const coord = model.getCursorCoord(e)
            const movement = {
                x: (coord.x - drag.start.x),
                y: (coord.y - drag.start.y)
            }

            // 移动整个stage
            if (model.hotKey["Space"] && model.hotKey['LeftMouseDown']) {
                model.setStagePosition(
                    model.x + movement.x,
                    model.y + movement.y
                );
            }

            if (select.isSelecting) {
                model.selectCells.forEach(id => {
                    const cellData = model.getCellData(id) as NodeDataType & CellDataType

                    if (cellData.cellType === 'node') {
                        model.setCellData(cellData.id, {
                            x: cellData.x + movement.x,
                            y: cellData.y + movement.y,
                        });
                    }
                })
            }

            drag.start.x = coord.x
            drag.start.y = coord.y
        },
        onMouseUp: (e, model) => {
            const { select } = model.buffer
            if (select.isSelecting) {
                model.selectCells.forEach(id => {
                    const cellData = model.getCellData(id) as NodeDataType & CellDataType

                    if (cellData.cellType === 'node') {
                        if (model.grid)
                            model.setCellData(cellData.id, model.snap({
                                x: cellData.x,
                                y: cellData.y
                            }));
                    }
                })

                select.isSelecting = false
            }
        }
    },
    scale: {
        onWheel: (e: React.WheelEvent, model) => {
            let scaleBy = 1.02
            e.preventDefault()
            e.stopPropagation()

            const oldScale = model.canvasData.scale;
            const pointer = model.getCursorCoord(e) as Vector2d;

            var mousePointTo = {
                x: (pointer.x - model.x) / oldScale,
                y: (pointer.y - model.y) / oldScale,
            };

            // how to scale? Zoom in? Or zoom out?

            let direction = e.deltaY > 0 ? 1 : -1;

            // in that case lets revert direction
            if (e.ctrlKey) {
                direction = -direction;
            }

            const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

            model.setStageScale(newScale);

            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };

            model.setStagePosition(newPos.x, newPos.y);
        }
    },
    multiSelect: {
        onMouseDown: (e, model) => {
            // if (model.hotKey['Space']) return
            if (model.buffer.select.isSelecting) return
            if (!model.hotKey["Space"] && e.button === EVT_LEFTCLICK) {
                const pos = model.getCursorCoord(e);
                model.setMultiSelect({
                    start: {
                        x: pos.x,
                        y: pos.y,
                    },
                    end: {
                        x: pos.x,
                        y: pos.y,
                    },
                });
            }
        },
        onMouseUp: (e, model) => {
            if (model.buffer.select.isSelecting) return
            const pos = model.getCursorCoord(e)
            model.setMultiSelect({
                start: {
                    x: pos.x,
                    y: pos.y,
                },
                end: {
                    x: pos.x,
                    y: pos.y,
                },
            }, true);
        },
        onMouseMove: (e, model) => {
            if (model.buffer.select.isSelecting) return
            if (!model.hotKey["Space"] && model.hotKey["LeftMouseDown"]) {
                const pos = model.getCursorCoord(e);
                model.setMultiSelect({
                    end: {
                        x: pos.x,
                        y: pos.y,
                    },
                });
            }
        }
    },
    hotkeys: {
        onMouseDown: (e, model) => {
            e.preventDefault()

            switch (e.button) {
                case EVT_LEFTCLICK: model.setHotKey('LeftMouseDown', true); break;
                case EVT_RIGHTCLICK: model.setHotKey('RightMouseDown', true)
            }
        },
        onMouseUp: (e, model) => {
            switch (e.button) {
                case EVT_LEFTCLICK: model.setHotKey('LeftMouseDown', false)
            }
        },
        onKeyDown: (e, model) => {
            switch (e.code) {
                case 'Space':
                    if (INPUT_NODELIST.includes((e.target as HTMLElement).nodeName)) return
                    e.preventDefault()
                    model.setHotKey(e.code, true)
            }
        },
        onKeyUp: (e, model) => {
            switch (e.code) {
                case 'Space':
                    if (INPUT_NODELIST.includes(((e.target as HTMLElement)).nodeName)) return
                    e.preventDefault()
                    model.setHotKey(e.code, false)
            }
        }
    },
}


export const initEvents = (behaviors: BehaviorName[], model: Model) => {
    const events: Record<StageEventName, React.MouseEventHandler<HTMLDivElement> | undefined> = {
        'onMouseMove': undefined, 'onMouseDown': undefined, 'onMouseUp': undefined, 'onWheel': undefined, 'onClick': undefined
    }

    for (let behavior in behaviorsMap) {
        let initFn;
        if (initFn = (behaviorsMap[behavior as BehaviorName] as {
            'init': InitFn
        })['init']) {
            initFn(model)
        }
    }

    for (let eventKey of STAGE_EVENT_NAMES) {
        events[eventKey as StageEventName] = (e: StageEventType) => {
            behaviors.forEach(behavior => {
                const cb = (behaviorsMap[behavior as BehaviorName] as {
                    [key in StageEventName]: StageEventFn
                })[eventKey as StageEventName] as StageEventFn
                if (cb) cb(e, model)
            })
        }
    }

    for (let eventKey of WINDOW_EVENT_NAMES) {
        behaviors.forEach(behavior => {
            const cb = (behaviorsMap[behavior as BehaviorName] as {
                [key in WindowEventName]: WindowEventFn
            })[eventKey as WindowEventName] as WindowEventFn
            if (cb) {
                window.addEventListener(eventKey.toLocaleLowerCase().replace('on', ''), e => cb(e as KeyboardEvent, model)
                )
            }
        })
    }

    return events;
}