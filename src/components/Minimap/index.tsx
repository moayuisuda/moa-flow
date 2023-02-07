import React, { useEffect } from "react";
import { useContext } from "react";
import { CellDataType, CellModel } from "../../cells";
import { FlowContext } from "../../Context";
import FlowModel from "../../Model";
import { observer } from "mobx-react";

const miniMapWidth = 300;
const miniMapHeight = 200;

const MapNodes = observer(() => {
  const context = useContext(FlowContext);
  const nodesData = context.canvasData.cells.filter((cellData) => {
    return cellData.cellType !== "edge";
  });
  return (
    <div
      style={{
        transform: `scale(${
          (1 / context.shrinkTimes, 1 / context.shrinkTimes)
        } )`,
        transformOrigin: "top left",
      }}
    >
      {nodesData
        .slice(0, nodesData.length)
        .map((cellData: { id: any; component: any }) => {
          return <MapPositionWrapper cellData={cellData} key={cellData.id} />;
        })}
    </div>
  );
});

const MapEdges = observer(() => {
  const context = useContext(FlowContext);
  const edgesData = context.canvasData.cells.filter(
    (cellData: CellDataType) => cellData.cellType === "edge"
  );
  const shrinkTimes = context.shrinkTimes;

  return (
    <svg
      viewBox={`0 0 ${miniMapWidth * shrinkTimes} ${
        miniMapHeight * shrinkTimes
      }`}
      style={{
        zIndex: 2,
        position: "absolute",
        pointerEvents: "none",
        transform: `scale(${
          (1 / context.shrinkTimes, 1 / context.shrinkTimes)
        } )`,
        transformOrigin: "top left",
      }}
      width={miniMapWidth * shrinkTimes}
      height={miniMapHeight * shrinkTimes}
    >
      {edgesData.map((cellData: { id: any; component: any }) => {
        return <MapPositionWrapper cellData={cellData} />;
      })}
    </svg>
  );
});

const MapCellComponent = observer(({ cellData }: { cellData: any }) => {
  const context = useContext(FlowContext);
  const Component = context.componentsMap.get(cellData.component) as React.FC<{
    model: CellModel;
  }>;
  const cellModel = context.cellsModelMap.get(cellData.id) as CellModel;
  return React.createElement(Component, {
    model: cellModel,
    key: cellData.id,
  });
});
const MapPositionWrapper = observer(({ cellData }: { cellData: any }) => {
  const isNode = cellData.cellType === "node";
  const context = useContext(FlowContext);
  const absolutePosition = context.getNodePosition(cellData.id);
  return React.createElement(isNode ? "div" : "g", {
    style: {
      position: "absolute",
      left: absolutePosition.x,
      top: absolutePosition.y,
    }, // 改变node位置不引起子组件渲染
    children: <MapCellComponent cellData={cellData} />,
  });
});

export const MiniMap = observer(
  (props: { shrinkTimes: number; show?: boolean }) => {
    const { shrinkTimes, show } = props;
    const context = useContext(FlowContext);
    const edgesData = context.canvasData.cells.filter(
      (cellData: CellDataType) => cellData.cellType === "edge"
    );
    const scale = context.scale;
    const miniMapViewBoxWidth = context.width / shrinkTimes;
    const miniMapViewBoxHeight = context.height / shrinkTimes;
    const centerBoxStart = (miniMapWidth - miniMapViewBoxWidth) / 2;
    const centerBoxEnd = (miniMapHeight - miniMapViewBoxHeight) / 2;
    const {
      buffer: { miniMap },
    } = context;
    const { dragging, mapDragging, mapScale, mapPosition } = miniMap;
    const [mapX, mapY] = mapPosition;
    const scaleBy = context.scaleBy;
    const newContext = Object.assign(context, { isMiniMap: true });

    return (
      <>
        {show ? (
          <FlowContext.Provider value={newContext as FlowModel}>
            <div
              style={{
                width: miniMapWidth,
                height: miniMapHeight,
                scale: mapScale,
                position: "absolute",
                right: "0px",
                bottom: " 0px",
                backgroundColor: "white",
                zIndex: "4",
                border: "1px solid black",
                userSelect: "none",
                overflow: "hidden",
              }}
              onWheelCapture={(e) => {
                let direction = e.deltaY > 0 ? scaleBy : 1 / scaleBy;
                context.buffer.miniMap.mapScale = mapScale * direction;
                e.stopPropagation();
              }}
              onMouseLeave={() => {
                context.buffer.miniMap = {
                  ...context.buffer.miniMap,
                  mapDragging: false,
                  dragging: false,
                };
              }}
              onMouseUp={() => {
                context.buffer.miniMap = {
                  ...context.buffer.miniMap,
                  mapDragging: false,
                  dragging: false,
                };
              }}
              onMouseMove={(e) => {
                const moverMentX = e.movementX;
                const moverMentY = e.movementY;
                if (mapDragging) {
                  context.buffer.miniMap.mapPosition = [
                    mapX + moverMentX,
                    mapY + moverMentY,
                  ];
                }
                if (dragging) {
                  const canvasData = context.canvasData;
                  context.setStagePosition(
                    canvasData.x - (moverMentX * shrinkTimes) / mapScale,
                    canvasData.y - (moverMentY * shrinkTimes) / mapScale
                  );
                }
              }}
              onMouseDown={(e) => {
                context.buffer.miniMap.mapDragging = true;
                e.stopPropagation();
              }}
              // onWheelCapture={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  position: "absolute",
                  left: mapX,
                  top: mapY,
                  width: miniMapWidth,
                  height: miniMapHeight,
                  scale: mapScale,
                  transform: `scale(${mapScale})`,
                  transformOrigin: "center",
                }}
              >
                <div
                  style={{
                    left: centerBoxStart,
                    top: centerBoxEnd,
                    position: "absolute",
                    pointerEvents: "none",
                  }}
                >
                  <MapNodes />
                  <MapEdges />
                </div>
                <div
                  style={{
                    border: "1px solid red",
                    width: miniMapViewBoxWidth / scale,
                    height: miniMapViewBoxHeight / scale,
                    position: "absolute",
                    left: centerBoxStart - context.x / shrinkTimes,
                    top: centerBoxEnd - context.y / shrinkTimes,
                    cursor: "pointer",
                  }}
                  onMouseDown={(e) => {
                    context.buffer.miniMap.dragging = true;
                    e.stopPropagation();
                  }}
                  onMouseUp={() => {
                    context.buffer.miniMap = {
                      ...context.buffer.miniMap,
                      mapDragging: false,
                      dragging: false,
                    };
                  }}
                />
              </div>
            </div>
          </FlowContext.Provider>
        ) : (
          ""
        )}
      </>
    );
  }
);
