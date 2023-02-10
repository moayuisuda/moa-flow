import { Dir, Vector2d } from "../typings/common";
import { PortDataType, PortDir } from "../components";
import React from "react";
import { isVector2d } from "../utils";
import { callIfFn } from "../utils/util";
import { CellModel, CellDataType } from "./Cell";
import { FlowModel } from "@/Model";
import { observer } from "mobx-react";
import { computed } from "mobx";

const TEXT_HEIGHT = 16;
const LABEL_PADDING = 4;

const dirMap = {
  left: [-1, 0],
  right: [1, 0],
  top: [0, -1],
  bottom: [0, 1],
};

export type EdgeDataType = {
  source: string | Vector2d;
  target: string | Vector2d;
  label: string;
  verticies: Vector2d[];
} & CellDataType;

// util type
export type EdgeData<D> = D & EdgeDataType;

type Head = React.ReactNode | boolean;
export class EdgeModel<
  D extends EdgeDataType = EdgeDataType
> extends CellModel {
  defaultData = (): any => ({
    component: "Edge", // 这里一般会被重置为FLowEdge这种业务类的线条
    source: "",
    target: "",
    label: "",
    verticies: [],
    cellType: "edge",
  });

  declare data: D;

  protected bazier: boolean | (() => boolean) = true;

  private pathInstance = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  constructor(data: any, context: FlowModel) {
    super(data, context);
  }

  getAnchors = () => {
    let sourceAnchor;
    let targetAnchor;

    if (isVector2d(this.data.source))
      sourceAnchor = this.data.source as Vector2d;
    else {
      const sourceInstance = this.context.getPortInstance(
        this.data.source as string
      );
      sourceAnchor = sourceInstance.anchor();
    }
    if (isVector2d(this.data.target))
      targetAnchor = this.data.target as Vector2d;
    else {
      const targetInstance = this.context.getPortInstance(
        this.data.target as string
      );
      targetAnchor = targetInstance.anchor();
    }

    return {
      source: sourceAnchor,
      target: targetAnchor,
    };
  };

  private getPoints = () => {
    const routeResult = this.route({ vectors: this.getVectors() });

    return this.vectorsToPoints(routeResult);
  };

  private getVectors = () => {
    const anchors = this.getAnchors();
    const verticies = this.data.verticies || [];

    return [anchors.source, ...verticies, anchors.target];
  };

  getLinkPortsData = () => {
    return {
      source: isVector2d(this.data.source)
        ? (this.data.source as Vector2d)
        : (this.context.getCellData(
            this.data.source as string
          ) as PortDataType),
      target: isVector2d(this.data.target)
        ? (this.data.target as Vector2d)
        : (this.context.getCellData(
            this.data.target as string
          ) as PortDataType),
    };
  };

  getLinkNodes = () => {
    const { data } = this;
    let source;
    let target;

    if (!isVector2d(data.source)) {
      const sourcePort = this.context.getCellData(
        data.source as string
      ) as PortDataType;
      source = sourcePort.host;
    }

    if (!isVector2d(data.target)) {
      const targetPort = this.context.getCellData(
        data.target as string
      ) as PortDataType;
      target = targetPort.host;
    }

    return {
      source,
      target,
    };
  };
  getLinkNodesData = () => {
    const { source, target } = this.getLinkNodes();
    return {
      source: source && this.context.getCellData(source),
      target: target && this.context.getCellData(target),
    };
  };

  route({ vectors }: { vectors: Vector2d[] }) {
    return vectors;
  }

  private vectorsToPoints = (vectors: Vector2d[]) => {
    const re: [number, number][] = [];
    vectors.forEach((vector) => {
      re.push([vector.x, vector.y]);
    });

    return re;
  };

  getPointAt = (ratioOrLength: number) => {
    this.pathInstance.setAttribute("d", this.d);
    if (ratioOrLength > 1)
      return this.pathInstance.getPointAtLength(ratioOrLength);
    return this.pathInstance.getPointAtLength(
      ratioOrLength * this.pathInstance.getTotalLength()
    );
  };

  label(label: string) {
    return label;
  }

  controlPointOffset = () => {
    return 60;
  };

  private getBazierDir = () => {
    const {
      props: { dir: sourceDir },
    } = this.context.getPortInstance(this.data.source as string);

    const getTargetDir = () => {
      const {
        props: { dir: targetDir },
      } = this.context.getPortInstance(this.data.target as string);

      return targetDir;
    };

    const LENGTH = this.controlPointOffset();
    return {
      source: [
        LENGTH * (sourceDir ? dirMap[sourceDir as PortDir][0] : 0),
        LENGTH * (sourceDir ? dirMap[sourceDir as PortDir][1] : 0),
      ],
      target: isVector2d(this.data.target)
        ? [0, 0]
        : [
            LENGTH *
              (getTargetDir() ? dirMap[getTargetDir() as PortDir][0] : 0),
            LENGTH *
              (getTargetDir() ? dirMap[getTargetDir() as PortDir][1] : 0),
          ],
    } as { source: Dir; target: Dir };
  };

  private getBazierPath = () => {
    const { source, target } = this.getAnchors();
    const dir = this.getBazierDir();

    return `M${source.x},${source.y} 
    C${source.x + dir.source[0]},${source.y + dir.source[1]} ${
      target.x + dir.target[0]
    },${target.y + dir.target[1]} 
    ${target.x},${target.y}`;
  };

  private getPolylinePath = () => {
    const points = this.getPoints();

    let str = `M${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      str += `L${points[i][0]},${points[i][1]}`;
    }

    return str;
  };

  @computed
  get d() {
    return callIfFn(this.bazier)
      ? this.getBazierPath()
      : this.getPolylinePath();
  }

  private defaultLineProps = () => ({
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    strokeWidth: 2,
    stroke: this.isSelect
      ? this.context.color.primary
      : this.context.color.base,
  });

  LineRender = observer(
    (
      props?: {
        pathProps?: React.SVGProps<SVGPathElement>;
        arrowProps?: React.SVGProps<SVGPathElement> & { size?: number };
        markerProps?: React.SVGProps<SVGMarkerElement>;
      } & React.SVGProps<SVGGElement>
    ) => {
      const { d } = this;
      const lineProps = this.defaultLineProps() as any;
      const pathProps = props?.pathProps || {};
      const arrowProps = props?.arrowProps || {};
      const markerProps = props?.markerProps || {};
      const arrowSize = arrowProps.size || DEFAULT_ARROW_SIZE;

      const { cos, sin, PI } = Math;
      const pathWidth = pathProps.strokeWidth || lineProps.strokeWidth;
      const arrowOffset = [
        (arrowProps.strokeWidth || pathWidth) / 2 || 0,
        (arrowProps.strokeWidth || pathWidth) / 2 || 0,
      ];

      // console.log(
      //   pathProps.fill ||
      //     lineProps.fill ||
      //     pathProps.stroke ||
      //     lineProps.stroke ||
      //     this.context.color.base
      // );

      return (
        <g {...props}>
          <defs>
            <marker
              id={`arrow-end--${this.data.id}`}
              markerWidth="100"
              markerHeight="100"
              refX={arrowOffset[0] + arrowSize * cos(PI / 6)}
              refY={arrowOffset[1] + arrowSize * sin(PI / 6)}
              orient="auto"
              {...markerProps}
            >
              <path
                className="moa-edge__arrow"
                stroke={pathProps.stroke || lineProps.stroke}
                strokeLinecap={
                  pathProps.strokeLinecap || lineProps.strokeLinecap
                }
                strokeLinejoin={
                  pathProps.strokeLinejoin || lineProps.strokeLinejoin
                }
                fill={
                  pathProps.stroke ||
                  lineProps.stroke ||
                  this.context.color.base
                }
                d={`M${arrowOffset[0]},${arrowOffset[1]} L${arrowOffset[0]},${
                  arrowSize * sin(PI / 6) * 2 + arrowOffset[1]
                } L${arrowSize * cos(PI / 6) + arrowOffset[0]},${
                  arrowSize * sin(PI / 6) + arrowOffset[1]
                } Z`}
                {...arrowProps}
              />
            </marker>
          </defs>

          <path
            className="moa-edge"
            {...lineProps}
            d={d}
            markerEnd={`url(#${`arrow-end--${this.data.id}`})`}
            {...pathProps}
          />
          <path
            className="moa-edge--interaction"
            {...lineProps}
            d={d}
            strokeWidth={10}
            fill="none"
            stroke="transparent"
          />
        </g>
      );
    }
  );

  LabelRender = observer((props?: React.SVGProps<SVGTextElement>) => {
    const position = this.getPointAt(0.5);
    const {
      refs: { svgContainerRef },
    } = this.context;

    const text = this.label(this.data.label);
    if (!text) return <></>;

    const textInstance = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    textInstance.innerHTML = text;

    (svgContainerRef as SVGElement).appendChild(textInstance);
    const textBounds = textInstance.getBBox();
    (svgContainerRef as SVGElement).removeChild(textInstance);

    return (
      <g transform={`translate(${position.x}, ${position.y})`}>
        <g
          transform={`translate(${-(textBounds.width + LABEL_PADDING) / 2}, ${
            -(TEXT_HEIGHT + LABEL_PADDING) / 2
          })`}
        >
          <rect
            width={textBounds.width + LABEL_PADDING * 2}
            height={TEXT_HEIGHT + LABEL_PADDING * 2}
            fill="white"
          ></rect>
          <text
            x={LABEL_PADDING}
            y={LABEL_PADDING}
            dominantBaseline="hanging"
            {...props}
          >
            {text}
          </text>
        </g>
      </g>
    );
  });

  EdgeRender = observer((props: React.SVGProps<SVGGElement>) => {
    return (
      <g {...props}>
        {/* 这个函数的返回只能返回 React.createElement(Line)，并没有收集model的依赖 */}
        <this.LineRender />
        <this.LabelRender />
      </g>
    );
  });
}

const DEFAULT_ARROW_SIZE = 4;

export const Edge: React.FC<{ model: EdgeModel }> = ({ model }) => {
  return <model.EdgeRender />;
};
