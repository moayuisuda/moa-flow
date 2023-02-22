import { Dir, Vector2d } from "../typings/common";
import { PortDataType, PortDir } from "../components";
import React from "react";
import { isVector2d } from "../utils";
import { callIfFn } from "../utils/util";
import { CellModel, CellDataType } from "./Cell";
import { FlowModel } from "@/Model";
import { observer } from "mobx-react";
import { computed } from "mobx";
import { generateConnectionPoints } from "../utils/line-routes/orth";

const TEXT_HEIGHT = 16;
const LABEL_PADDING = 4;
const LINE_EXTRA = 40;

const DIR_MAP = {
  left: [-1, 0],
  right: [1, 0],
  top: [0, -1],
  bottom: [0, 1],
};

export type EdgeDataType = {
  source: string | Vector2d;
  target: string | Vector2d;
  label: string;
  vertices: Vector2d[];
} & CellDataType;

// util type
export type EdgeData<D> = D & EdgeDataType;

export enum LineType {
  ORTH = "orth",
  BEZIER = "bezier",
  POLYLINE = "polyline",
}
export class EdgeModel<
  D extends EdgeDataType = EdgeDataType
> extends CellModel {
  defaultData = (): any => ({
    component: "Edge", // 这里一般会被重置为FlowEdge这种业务类的线条
    source: "",
    target: "",
    label: "",
    vertices: [],
    cellType: "edge",
  });

  declare data: D;

  protected lineType: LineType | (() => LineType) = LineType.BEZIER;

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
    const vertices = this.data.vertices || [];

    return [anchors.source, ...vertices, anchors.target];
  };

  getLinkPortsInstance = () => {
    return {
      source: this.context.getPortInstance(this.data.source as string),
      target: this.context.getPortInstance(this.data.target as string),
    };
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
    if (this.lineType === LineType.ORTH) {
      const { source, target } = this.getLinkPortsInstance();
      const { source: sourceAnchor, target: targetAnchor } = this.getAnchors();
      // if target port does not exist(when linking), fallback to this dir
      let fallbackDir = sourceAnchor.x > targetAnchor.x ? [1, 0] : [-1, 0];
      return generateConnectionPoints(
        {
          sourcePoint: [sourceAnchor.x, sourceAnchor.y],
          sourceDir: DIR_MAP[source.props.dir as keyof typeof DIR_MAP],
          sourceExt: LINE_EXTRA,

          targetPoint: [targetAnchor.x, targetAnchor.y],
          targetDir: target
            ? DIR_MAP[target.props.dir as keyof typeof DIR_MAP]
            : fallbackDir,
          targetExt: LINE_EXTRA,
        },
        0.5
      ).map(({ position }) => ({
        x: position[0],
        y: position[1],
      }));
    }

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

  private getBezierDir = () => {
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
        LENGTH * (sourceDir ? DIR_MAP[sourceDir as PortDir][0] : 0),
        LENGTH * (sourceDir ? DIR_MAP[sourceDir as PortDir][1] : 0),
      ],
      target: isVector2d(this.data.target)
        ? [0, 0]
        : [
            LENGTH *
              (getTargetDir() ? DIR_MAP[getTargetDir() as PortDir][0] : 0),
            LENGTH *
              (getTargetDir() ? DIR_MAP[getTargetDir() as PortDir][1] : 0),
          ],
    } as { source: Dir; target: Dir };
  };

  private getBezierPath = () => {
    const { source, target } = this.getAnchors();
    const dir = this.getBezierDir();

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
    return callIfFn(this.lineType) === "bezier"
      ? this.getBezierPath()
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
      let { pathProps, arrowProps, markerProps, ...others } = props || {};
      const { d } = this;
      const lineProps = this.defaultLineProps() as any;
      pathProps = props?.pathProps || {};
      arrowProps = props?.arrowProps || {};
      markerProps = props?.markerProps || {};
      const arrowSize = arrowProps.size || DEFAULT_ARROW_SIZE;

      const { cos, sin, PI } = Math;
      const pathWidth = pathProps.strokeWidth || lineProps.strokeWidth;
      const arrowOffset = [
        (arrowProps.strokeWidth || pathWidth) / 2 || 0,
        (arrowProps.strokeWidth || pathWidth) / 2 || 0,
      ];

      return (
        <g {...others}>
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
