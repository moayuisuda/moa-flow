import React from "react";
import { useContext } from "react";
import { CellDataType, CellModel } from "../../cells";
import { FlowContext } from "../../Context";
import FlowModel from "../../Model";
import { observer } from "mobx-react";

const ShrinkWaraper = (props: {
  scale: number;
  children: any;
  shrinkTimes: number;
}) => {
  return (
    <div
      style={{
        transform: `scale(${props.scale / props.shrinkTimes} )`,
        transformOrigin: "top left",
      }}
    >
      {props.children}
    </div>
  );
};
const miniMapWidth = 300;
const miniMapHeight = 200;
const MapCellComponet = observer(({ cellData }: { cellData: any }) => {
  const isNode = cellData.cellType === "node";
  const context = useContext(FlowContext);
  const absolutePosition = context.getNodePosition(cellData.id);
  const Component = context.componentsMap.get(cellData.component) as React.FC<{
    model: CellModel;
  }>;
  const cellModel = context.cellsModelMap.get(cellData.id) as CellModel;
  return React.createElement(isNode ? "div" : "g", {
    style: {
      position: "absolute",
      left: absolutePosition.x,
      top: absolutePosition.y,
    },
    children: React.createElement(Component, {
      model: cellModel,
      key: cellData.id,
    }),
  });
});
export const MiniMap = observer(
  (props: { shrinkTimes: number; show?: boolean }) => {
    const { shrinkTimes, show } = props;
    const context = useContext(FlowContext);
    const nodesData = context.canvasData.cells.filter((cellData) => {
      return cellData.cellType !== "edge";
    });
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

    return (
      <>
        {show ? (
          <FlowContext.Provider
            value={{ ...context, isMiniMap: true } as FlowModel}
          >
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
                    canvasData.x -
                      (moverMentX * shrinkTimes) / scale / mapScale,
                    canvasData.y - (moverMentY * shrinkTimes) / scale / mapScale
                  );
                }
              }}
              onMouseDown={(e) => {
                console.log("aaa");
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
                onWheelCapture={(e) => {
                  let direction = e.deltaY > 0 ? scaleBy : 1 / scaleBy;
                  context.buffer.miniMap.mapScale = mapScale * direction;
                  e.stopPropagation();
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
                  <ShrinkWaraper scale={scale} shrinkTimes={shrinkTimes}>
                    {nodesData
                      .slice(0, nodesData.length)
                      .map((cellData: { id: any; component: any }) => {
                        return <MapCellComponet cellData={cellData} />;
                      })}
                  </ShrinkWaraper>
                  <ShrinkWaraper shrinkTimes={shrinkTimes} scale={scale}>
                    <svg
                      viewBox={`0 0 ${miniMapWidth * shrinkTimes} ${
                        miniMapHeight * shrinkTimes
                      }`}
                      style={{
                        zIndex: 2,
                        position: "absolute",
                        pointerEvents: "none",
                      }}
                      width={miniMapWidth * shrinkTimes}
                      height={miniMapHeight * shrinkTimes}
                    >
                      {edgesData.map(
                        (cellData: { id: any; component: any }) => {
                          return <MapCellComponet cellData={cellData} />;
                        }
                      )}
                    </svg>
                  </ShrinkWaraper>
                </div>
                <div
                  style={{
                    border: "1px solid red",
                    width: miniMapViewBoxWidth,
                    height: miniMapViewBoxHeight,
                    position: "absolute",
                    left: centerBoxStart - (context.x / shrinkTimes) * scale,
                    top: centerBoxEnd - (context.y / shrinkTimes) * scale,
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
