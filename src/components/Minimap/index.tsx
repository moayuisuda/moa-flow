import { isFunction } from "lodash";
import { observer } from "mobx-react";
import React, { useContext, useEffect, useRef } from "react";
import { FlowContext } from "../../Context";

const Node = observer(
  (props: {
    width: number;
    height: number;
    nodeColor: any;
    x: number;
    y: number;
    cellModel: any;
    id: string;
  }) => {
    const { width, height, nodeColor, x, y, id, cellModel } = props;
    return (
      <rect
        key={id}
        className="moa-flow-minimap-nodes"
        x={x}
        y={y}
        rx="4"
        ry="4"
        width={width}
        height={height}
        fill={isFunction(nodeColor) ? nodeColor(cellModel) : nodeColor}
        strokeWidth="4"
      />
    );
  }
);

const MiniMap = observer(
  (
    props: {
      width?: number; // 默认宽度
      height?: number; // 默认高度
      nodeColor?: string | ((node: any) => string); //节点颜色
      position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"; // 节点位置
    } & React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
  ) => {
    const {
      width: defaultWidth = 200,
      height: defaultHeight = 150,
      style,
      nodeColor = "#e2e2e2",
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

    const width = viewWidth / mapScale;
    const height = viewHeight / mapScale;

    const shrinkHeightTimes = elementHeight / height;
    const shrinkWidthTimes = elementWidth / width;

    const mapOffestX = mapX / shrinkWidthTimes;
    const mapOffestY = mapY / shrinkHeightTimes;

    const _x = boundingRect.x - (viewWidth - boundingRect.width) / 2;
    const x = _x - (width - viewWidth) / 2 - mapOffestX;
    const _y = boundingRect.y - (viewHeight - boundingRect.height) / 2;
    const y = _y - (height - viewHeight) / 2 - mapOffestY;

    const svg = useRef<SVGSVGElement>(null);

    useEffect(() => {
      const nodes = canvasData?.cells.filter(
        (item) => item.cellType === "node"
      );

      const boundingRect = [
        ...nodes,
        { x: 0, y: 0, width: viewBB.width, height: viewBB.height },
      ].reduce(
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
    }, [canvasData.cells.length]);

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
            className="moa-floa-minimap"
            style={{
              scale: mapScale,
              backgroundColor: "white",
              zIndex: "4",
              border: "1px solid black",
              position: "absolute",
              userSelect: "none",
              overflow: "hidden",
              ...mapAbsolutePosition,
              ...(props.style || {}),
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

                context.setStagePosition(
                  canvasData.x - moverMentX / shrinkHeightTimes,
                  canvasData.y - moverMentY / shrinkWidthTimes
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
            <svg
              width={elementWidth}
              height={elementHeight}
              viewBox={`${x} ${y}
               ${width} ${height}`}
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
                const cellModel = context.getCellModel(node.id);

                return (
                  <Node
                    id={node.id}
                    cellModel={cellModel}
                    key={node.id}
                    width={width}
                    height={height}
                    nodeColor={nodeColor}
                    x={x}
                    y={y}
                  />
                );
              })}
            </svg>
            <div
              className="moa-flow-minimap-viewbox"
              style={{
                border: "1px solid red",
                width: boxWidth,
                height: boxHeight,
                position: "absolute",
                left: startX,
                top: startY,
                cursor: "pointer",
                borderColor: "none",
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
