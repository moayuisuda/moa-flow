import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { ModelType } from ".";
import { extendObservable } from "mobx"

export const initStage = (model: ModelType, stage: Konva.Stage) => {
    stage.on('mousedown', e => {
        model.clearSelect();
        model.setHotKey('MouseDown', true)
    })

    stage.on('mouseup', e => {
        model.clearLinkBuffer();
        model.setHotKey('MouseDown', false)
    })
}

export const initDrag = (model: ModelType, stage: Konva.Stage) => {
    stage.on('mousemove', e => {
        if (model.hotKey["Space"] && model.hotKey["MouseDown"]) {
            model.setStagePosition(
                e.currentTarget.attrs.x + e.evt.movementX,
                e.currentTarget.attrs.y + e.evt.movementY
            );
        }
    })
}

export const initMultiSelect = (model: ModelType, stage: Konva.Stage) => {
    stage.on('mousedown', () => {
        if (!model.hotKey["Space"]) {
            const pos = stage.getRelativePointerPosition();
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
    })

    stage.on('mouseup', () => {
        if (model.buffer.select.single) return
        const pos = stage.getRelativePointerPosition();
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
    })

    stage.on('mousemove', () => {
        if (!model.hotKey["Space"] && model.hotKey["MouseDown"]) {
            const pos = stage.getRelativePointerPosition();
            model.setMultiSelect({
                end: {
                    x: pos.x,
                    y: pos.y,
                },
            });
        }
    })
}

export const initLinkingLine = (model: ModelType, stage: Konva.Stage) => {
    stage.on('mousemove', e => {
        const {
            buffer: { link },
        } = model;

        if (!link.source) return;
        model.setLinkingPosition(e);
    })
}

export const initHotKeys = (model) => {
    const { hotKey } = model

    window.addEventListener('keydown', e => {
        if (e.code in hotKey) {
            model.setHotKey(e.code, true)
        } else {
            extendObservable(hotKey, {
                [e.code]: true
            })
        }
    })

    window.addEventListener('keyup', e => {
        if (e.code in hotKey) {
            model.setHotKey(e.code, false)
        } else {
            extendObservable(hotKey, {
                [e.code]: false
            })
        }
    })
}