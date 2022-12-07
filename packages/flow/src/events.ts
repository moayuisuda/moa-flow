import Model, { FlowModel } from "./Model";
import { autorun } from "mobx";
import { without } from "lodash";
import { NodeDataType, NodeModel } from './cells/Node';
import { CellDataType, CellModel } from "./cells/Cell";
import {
  EVT_LEFTCLICK,
  EVT_RIGHTCLICK,
} from "./constants";
import {
  BehaviorName,
  Vector2d,
} from "./typings/common";

type StageEventType = React.WheelEvent | React.MouseEvent;
interface StageEventFn {
  (e: StageEventType, model: Model): any;
}

interface WindowEventFn {
  (e: KeyboardEvent, model: Model): any;
}

//一开始挂载在window上的fn
interface InitFn {
  (model: Model): any;
}

type MountTarget = "stage" | "window";

const INPUT_NODELIST = ["TEXTAREA", "INPUT"];

type EventMaps = Record<
  BehaviorName,
  {
    [index: string]: {
      handler: (
        e: any,
        model: FlowModel
      ) => void | ((model: FlowModel) => void);
      mountTarget?: MountTarget;
      passive?: boolean;
    };
  }
>;

export const behaviorsMap: EventMaps = {
  clearState: {
    onMouseDown: {
      handler: (e, model) => {
        if (!model.isSelecting(e) && e.button === EVT_LEFTCLICK)
          model.clearSelect();

        if (e.button === EVT_LEFTCLICK) {
          model.contextMenuVisible = false;
        }
      },
      mountTarget: "stage",
    },
  },
  link: {
    onMouseUp: {
      handler: (e, model) => {
        model.clearLinkBuffer();
      },
      mountTarget: "stage",
    },
    onMouseMove: {
      handler: (e: React.MouseEvent, model) => {
        const {
          buffer: { link },
        } = model;

        if (!link.source) return;
        model.setLinkingPosition(model.getCursorCoord(e));
      },
      mountTarget: "stage",
    },
  },
  select: {
    init: {
      handler: (model) => {
        // 非受控设置select的节点
        let prevSelectCells: string[] = [];
        autorun(() => {
          // 上次存在这次不存在的就是需要设置为false的
          const toFalseCells = without(prevSelectCells, ...model.selectCells);
          // 这次存在上次不存在的就是需要设置为true的
          const toTrueCells = without(model.selectCells, ...prevSelectCells);

          toFalseCells.forEach((cellId) => {
            const cellModel = model.getCellModel(cellId) as CellModel;
            cellModel && (cellModel.isSelect = false);
          });

          toTrueCells.forEach((cellId) => {
            const cellModel = model.getCellModel(cellId) as CellModel;
            cellModel && (cellModel.isSelect = true);
          });

          prevSelectCells = model.selectCells.slice();
        });
      },
    },
  },
  drag: {
    onMouseMove: {
      handler: (e, model) => {
        const { select } = model.buffer;
        // 这里是 e.movementX 不是 movement.x，如果用movement.x，那每一次移动，上次的dragStart实际已经不适用于新的坐标系了，而e.movement就不会，只记录从鼠标开始到结束
        const movement = {
          x: e.movementX / model.scale,
          y: e.movementY / model.scale,
        };

        // 移动整个stage
        const multiSelectCanDrag =
          model.multiSelect &&
          model.hotKey["Space"] &&
          model.hotKey["LeftMouseDown"];
        const singleSelectCanDrag =
          !model.multiSelect && model.hotKey["LeftMouseDown"];
        if (
          (multiSelectCanDrag || singleSelectCanDrag) &&
          !model.selectCells.length
        ) {
          model.setStagePosition(model.x + movement.x, model.y + movement.y);
        }

        if (select.isSelecting) {
          model.selectCells.forEach((id) => {
            const cellData = model.getCellData(id) as NodeDataType &
              CellDataType;
            if (cellData.cellType === "node" && !(cellData.drag === false)) {
              model.moveNodesRecursively(cellData.id, movement)
            }
          });
        }
      },
      mountTarget: "stage",
    },
    onMouseUp: {
      handler: (e, model) => {
        const { select } = model.buffer;
        if (select.isSelecting) {
          model.selectCells.forEach((id) => {
            const cellData = model.getCellData(id) as NodeDataType &
              CellDataType;

            if (cellData.cellType === "node" && !(cellData.drag === false)) {
              if (model.grid)
                model.setCellData(
                  cellData.id,
                  model.snap({
                    x: cellData.x,
                    y: cellData.y,
                  })
                );
            }
          });

          select.isSelecting = false;
          select.selectingDom = undefined;
        }
      },
      mountTarget: "stage",
    },
  },
  scale: {
    onWheel: {
      handler: (e: React.WheelEvent, model) => {
        /**
         * 获取当前坐标 p0
         * 获取鼠标当前位置在scale后的坐标 p1
         * p1与p0的差
         */
        let scaleBy = model.scaleBy;
        e.preventDefault();
        e.stopPropagation();

        const oldScale = model.scale;
        const oldPointer = model.getCursorCoord(e) as Vector2d;

        // how to scale? Zoom in? Or zoom out?
        let direction = e.deltaY > 0 ? 1 : -1;

        // in that case lets revert direction
        if (e.ctrlKey) {
          direction = -direction;
        }

        const newScale =
          direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        const scaleTo = direction > 0 ? scaleBy : 1 / scaleBy;

        model.setStageScale(newScale);

        const preCursorNowPointer = {
          x: (oldPointer.x + model.x) / scaleTo - model.x,
          y: (oldPointer.y + model.y) / scaleTo - model.y,
        };
        // 用原本的pointer的坐标减去之前鼠标相同位置的现在pointer画布坐标
        const moveBack = {
          x: oldPointer.x - preCursorNowPointer.x,
          y: oldPointer.y - preCursorNowPointer.y,
        };

        model.setStagePosition(model.x - moveBack.x, model.y - moveBack.y);
      },
      mountTarget: "stage",
      passive: true,
    },
  },
  multiSelect: {
    onMouseDown: {
      handler: (e, model) => {
        // if (model.hotKey['Space']) return
        if (model.isSelecting(e)) return;
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
      mountTarget: "stage",
    },
    onMouseUp: {
      handler: (e, model) => {
        if (model.buffer.select.isSelecting) return;
        const pos = model.getCursorCoord(e);
        model.setMultiSelect(
          {
            start: {
              x: pos.x,
              y: pos.y,
            },
            end: {
              x: pos.x,
              y: pos.y,
            },
          },
          true
        );
      },
      mountTarget: "stage",
    },
    onMouseMove: {
      handler: (e, model) => {
        if (model.buffer.select.isSelecting) return;
        if (!model.hotKey["Space"] && model.hotKey["LeftMouseDown"]) {
          const pos = model.getCursorCoord(e);
          model.setMultiSelect({
            end: {
              x: pos.x,
              y: pos.y,
            },
          });
        }
      },
      mountTarget: "stage",
    },
  },
  hotkeys: {
    onMouseDown: {
      handler: (e, model) => {
        switch (e.button) {
          case EVT_LEFTCLICK:
            model.setHotKey("LeftMouseDown", true);
            break;
          case EVT_RIGHTCLICK:
            model.setHotKey("RightMouseDown", true);
        }
      },
      mountTarget: "stage",
    },
    onMouseUp: {
      handler: (e, model) => {
        // @ts-ignore
        switch (e.button) {
          case EVT_LEFTCLICK:
            model.setHotKey("LeftMouseDown", false);
        }
      },
      mountTarget: "stage",
    },
    onKeyDown: {
      handler: (e, model) => {
        switch (e.code) {
          case "Space":
            if (INPUT_NODELIST.includes((e.target as HTMLElement).nodeName))
              return;
            e.preventDefault();
            model.setHotKey(e.code, true);

          case "KeyZ": //新加撤销事件
            if (!e.shiftKey && model.hotKey["MetaLeft"]) return model.undo();
            if (e.shiftKey && model.hotKey["MetaLeft"]) return model.redo();

            if (!e.shiftKey && model.hotKey["ControlLeft"]) return model.undo();
            if (e.shiftKey && model.hotKey["ControlLeft"]) return model.redo();
          case "MetaLeft": //添加热键
            e.preventDefault();
            model.setHotKey(e.code, true);

          case "ControlLeft": //添加热键
            e.preventDefault();
            model.setHotKey(e.code, true);
        }
      },
      mountTarget: "window",
    },
    onKeyUp: {
      handler: (e, model) => {
        switch (e.code) {
          case "Space":
            if (INPUT_NODELIST.includes((e.target as HTMLElement).nodeName))
              return;
            e.preventDefault();
            model.setHotKey(e.code, false);

          case "MetaLeft": //添加热键
            e.preventDefault();
            model.setHotKey(e.code, false);

          case "ControlLeft": //添加热键
            e.preventDefault();
            model.setHotKey(e.code, false);
        }
      },
      mountTarget: "window",
    },
  },
};

export const mountEvents = (behaviors: BehaviorName[], model: Model) => {
  const stageEvents: Record<string, Function[]> = {
    onMouseDown: [],
    onMouseUp: [],
    onMouseMove: [],
    onWheel: [],
    onClick: [],
  };

  for (let behaviorName of behaviors) {
    const behaviorConfig = behaviorsMap[behaviorName];
    Object.keys(behaviorConfig).forEach((eventName) => {
      if (eventName === "init" && !model.isInitEvents) {
        (behaviorConfig[eventName].handler as (model: FlowModel) => void)(
          model
        );
      }

      const eventConfig = behaviorConfig[eventName];
      const { handler, mountTarget, passive } = eventConfig;
      switch (mountTarget) {
        case "stage": {
          if (passive && !model.isInitEvents) {
            Promise.resolve().then(() => {
              model.refs.stageRef?.addEventListener(
                eventName.replace("on", "").toLocaleLowerCase(),
                (e) => handler(e as any, model)
              );
            });
          }
          if (stageEvents[eventName]) {
            stageEvents[eventName].push(handler);
          } else stageEvents[eventName] = [handler];
          break;
        }

        case "window": {
          if (!model.isInitEvents) {
            window.addEventListener(
              eventName.toLocaleLowerCase().replace("on", ""),
              (e) => handler(e as KeyboardEvent, model)
            );
          }
        }
      }
    });
  }

  const stageEventsHandler: any = {};
  Object.keys(stageEvents).forEach((eventName) => {
    stageEventsHandler[eventName] = (e: any) => {
      stageEvents[eventName as keyof typeof stageEvents].forEach((callback) => {
        callback(e, model);
      });
    };
  });

  model.isInitEvents = true;
  return stageEventsHandler;
};
