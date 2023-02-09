import { isFunction } from "lodash";
import { observer } from "mobx-react";
import React, { useContext, useEffect, useRef } from "react";
import { FlowContext } from "../../Context";

const Node = observer(
  (props: {
    node: any;
    nodeClassName: any;
    nodeBorderRadius: any;
    width: any;
    height: any;
    nodeColor: any;
    nodeStrokeColor: any;
    nodeStrokeWidth: any;
    x: any;
    y: any;
  }) => {
    const {
      node,
      nodeClassName,
      nodeBorderRadius,
      width,
      height,
      nodeColor,
      nodeStrokeColor,
      nodeStrokeWidth,
      x,
      y,
    } = props;

    return (
      <rect
        key={node.id}
        className={nodeClassName}
        x={x}
        y={y}
        rx={nodeBorderRadius}
        ry={nodeBorderRadius}
        width={width}
        height={height}
        fill={isFunction(nodeColor) ? nodeColor(node) : nodeColor}
        stroke={
          isFunction(nodeStrokeColor) ? nodeStrokeColor(node) : nodeStrokeColor
        }
        strokeWidth={nodeStrokeWidth}
      />
    );
  }
);
const MiniMap = observer(
  (props: {
    style: React.CSSProperties;
    defaultWidth: number;
    defaultHeight: number;

    nodeClassName: string;
    mapClassName: string;
    viewBoxClassName: string;

    nodeStrokeColor: string;
    nodeColor: string;
    nodeStrokeWidth: number;
    nodeBorderRadius: number;

    viewBoxStyle: React.CSSProperties;

    position: string;
  }) => {
    const {
      defaultWidth = 200,
      defaultHeight = 150,
      style,
      nodeClassName = "",
      mapClassName = "",
      viewBoxClassName = "",
      nodeStrokeColor = "transparent",
      nodeColor = "#e2e2e2",
      nodeStrokeWidth = 2,
      nodeBorderRadius = 5,
      viewBoxStyle = {},
      position = "bottom-right",
    } = props;
    const context = useContext(FlowContext);

    const {
      buffer: { miniMap },
      canvasData,
      scaleBy,
    } = context;

    const elementWidth = (style?.width as number) ?? defaultWidth; // 小地图宽度
    const elementHeight = (style?.height as number) ?? defaultHeight; // 小地图高度

    const scale = context.scale;
    const { dragging, mapDragging, mapScale, mapPosition } = miniMap;
    const [mapX, mapY] = mapPosition;

    const viewBB = {
      x: -context.x,
      y: -context.y,
      width: context.width / scale,
      height: context.height / scale,
    };

    const { showMiniMap, boundingRect } = miniMap;

    const scaledWidth = boundingRect.width / elementWidth; // 缩小至小地图宽scale
    const scaledHeight = boundingRect.height / elementHeight; // 缩小至小地图高scale
    const viewScale = Math.max(scaledWidth, scaledHeight); //取最大值
    const viewWidth = viewScale * elementWidth;
    const viewHeight = viewScale * elementHeight;
    const offset = 5 * viewScale;
    const x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
    const y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
    const width = viewWidth + offset * 2;
    const height = viewHeight + offset * 2;
    const svg = useRef<SVGSVGElement>(null);

    useEffect(() => {
      const nodes = canvasData?.cells.filter(
        (item) => item.cellType === "node"
      );

      const boundingRect = nodes.reduce(
        (pre, cur) => {
          const width =
            cur.width ||
            (context.getWrapperRef(cur.id).current?.offsetWidth as number);
          const height =
            cur.height ||
            (context.getWrapperRef(cur.id).current?.offsetHeight as number);
          return {
            x1: pre.x1 ? Math.min(pre.x1, cur.x) : cur.x,
            y1: pre.y1 ? Math.min(pre.y1, cur.y) : cur.y,
            x2: pre.x2 ? Math.max(pre.x2, cur.x + width) : cur.x,
            y2: pre.y2 ? Math.max(pre.y2, cur.y + height) : cur.y,
          };
        },
        {
          x1: undefined,
          y1: undefined,
          x2: undefined,
          y2: undefined,
        }
      );
      context.setMiniMap({
        boundingRect: {
          x: boundingRect.x1,
          y: boundingRect.y1,
          width: boundingRect.x2 - boundingRect.x1,
          height: boundingRect.y2 - boundingRect.y1,
        },
        showMiniMap: true,
      });
    }, [context.x, context.y, context.scale, viewWidth, viewHeight]);

    const nodes = canvasData.cells.filter((cell) => cell.cellType === "node");

    const mapAbsolutePosition = position?.split("-").reduce((pre, cur) => {
      return {
        [cur]: 0,
        ...pre,
      };
    }, {});
    const viewBoxShrinkTimes = width / viewBB.width;
    const boxWidth = elementWidth / viewBoxShrinkTimes;
    const boxHeight = elementHeight / viewBoxShrinkTimes;
    const startX = ((viewBB.x - x) / width) * elementWidth;
    const startY = ((viewBB.y - y) / height) * elementHeight;

    return (
      <>
        {showMiniMap ? (
          <div
            className={mapClassName}
            style={{
              scale: mapScale,
              backgroundColor: "white",
              zIndex: "4",
              border: "1px solid black",
              position: "absolute",
              userSelect: "none",
              overflow: "hidden",
              ...mapAbsolutePosition,
              ...style,
              width: elementWidth,
              height: elementHeight,
            }}
            onWheelCapture={(e) => {
              let direction = e.deltaY > 0 ? scaleBy : 1 / scaleBy;
              context.setMiniMap({
                mapScale: mapScale * direction,
              });
              e.stopPropagation();
            }}
            onMouseLeave={() => {
              context.setMiniMap({
                mapDragging: false,
                dragging: false,
              });
            }}
            onMouseUp={() => {
              context.setMiniMap({
                mapDragging: false,
                dragging: false,
              });
            }}
            onMouseMove={(e) => {
              const moverMentX = e.movementX;
              const moverMentY = e.movementY;
              if (mapDragging) {
                context.setMiniMap({
                  mapPosition: [mapX + moverMentX, mapY + moverMentY],
                });
              }
              if (dragging) {
                const canvasData = context.canvasData;
                const shrinkHeightTimes = elementHeight / height;
                const shrinkWidthTimes = elementWidth / width;
                context.setStagePosition(
                  canvasData.x - moverMentX / shrinkHeightTimes / mapScale,
                  canvasData.y - moverMentY / shrinkWidthTimes / mapScale
                );
              }
            }}
            onMouseDown={(e) => {
              context.setMiniMap({
                mapDragging: true,
              });
              e.stopPropagation();
            }}
            // onWheelCapture={(e) => e.stopPropagation()}
          >
            <div
              style={{
                position: "absolute",
                left: mapX,
                top: mapY,
                width: elementWidth,
                height: elementHeight,
                scale: mapScale,
                transform: `scale(${mapScale})`,
                transformOrigin: "left top",
              }}
            >
              <svg
                width={elementWidth}
                height={elementHeight}
                viewBox={`${x} ${y} ${width} ${height}`}
                role="img"
                ref={svg}
                onClick={(e) => e.stopPropagation()}
              >
                {nodes.map((node) => {
                  const { x, y } = node;
                  const width = context.getWrapperRef(node.id).current
                    ?.offsetWidth as number;
                  const height = context.getWrapperRef(node.id).current
                    ?.offsetHeight as number;
                  return (
                    <Node
                      node={node}
                      nodeClassName={nodeClassName}
                      nodeBorderRadius={nodeBorderRadius}
                      width={width}
                      height={height}
                      nodeColor={nodeColor}
                      nodeStrokeColor={nodeStrokeColor}
                      nodeStrokeWidth={nodeStrokeWidth}
                      x={x}
                      y={y}
                    />
                  );
                })}
              </svg>

              <div
                className={viewBoxClassName}
                style={{
                  border: "1px solid red",
                  width: boxWidth,
                  height: boxHeight,
                  position: "absolute",
                  left: startX,
                  top: startY,
                  cursor: "pointer",
                  borderColor: "none",
                  ...viewBoxStyle,
                }}
                onMouseDown={(e) => {
                  context.setMiniMap({
                    dragging: true,
                  });
                  e.stopPropagation();
                }}
                onMouseUp={() => {
                  context.setMiniMap({
                    mapDragging: false,
                    dragging: false,
                  });
                }}
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    );
  }
);

export const getMiniMap = (children: React.ReactNode[] | React.ReactNode) => {
  return React.Children.toArray(children).find((item: { type }) => {
    return item.type === MiniMap;
  });
};

export { MiniMap };
