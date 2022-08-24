import { Dir, Vector2d } from "../typings/common";
import { PortDataType } from "../components";
import React from "react";
import { isVector2d } from "../utils";
import { callIfFn } from "../utils/util";
import { CellModel, CellDataType } from "./Cell";
import { useContext } from "react";
import { FlowContext } from "../Context";
import { FlowModel } from "Model";
import { observer } from "mobx-react-lite";
import { computed } from "mobx";

const TEXT_HEIGHT = 16;
const LABEL_PADDING = 4;

export type EdgeDataType = {
  source: string | Vector2d;
  target: string | Vector2d;
  label: string;
  verticies?: Vector2d[];
} & CellDataType;
type Head = React.ReactNode | boolean;
export class EdgeModel extends CellModel {
  defaultData = () => ({
    id: "",
    component: "Edge", // 这里一般会被重置为FLowEdge这种业务类的线条
    source: "",
    target: "",
    label: "",
    verticies: [],
    cellType: "edge",
  });

  data: EdgeDataType;

  protected bazier: boolean | (() => boolean) = false;
  protected startHead: Head | (() => Head) = false;
  protected endHead: Head | (() => Head) = true;

  pathInstance = document.createElementNS("http://www.w3.org/2000/svg", "path");

  isMountEvents = false;

  constructor(data: any, context: FlowModel) {
    super(data, context);
  }

  protected formatVerticied = (verticies: Vector2d[]) => {
    return verticies;
  };

  getLinkPortsData = () => {
    return {
      source: isVector2d(this.data.source)
        ? (this.data.source as Vector2d)
        : (this.context.cellsDataMap.get(
          this.data.source as string
        ) as PortDataType),
      target: isVector2d(this.data.target)
        ? (this.data.target as Vector2d)
        : (this.context.cellsDataMap.get(
          this.data.target as string
        ) as PortDataType),
    };
  };

  getAnchors = () => {
    let sourceAnchor;
    let targetAnchor;

    if (isVector2d(this.data.source)) sourceAnchor = this.data.source;
    else {
      const sourceInstance = this.context.cellsMap.get(
        this.data.source as string
      );
      sourceAnchor = sourceInstance.anchor();
    }
    if (isVector2d(this.data.target)) targetAnchor = this.data.target;
    else {
      const targetInstance = this.context.cellsMap.get(
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
    const routeResult = this.route(this.getVectors());

    return this.vectorsToPoints(routeResult);
  }

  getVectors = () => {
    const anchors = this.getAnchors();
    const verticies = this.data.verticies || [];

    return [anchors.source, ...verticies, anchors.target];
  }

  getLinkNodesData = () => {
    const { data } = this;
    let source;
    let target;

    if (!isVector2d(data.source)) {
      const sourcePort = this.context.cellsMap.get(data.source as string);
      source = this.context.cellsMap.get(sourcePort.host as string);
    }

    if (!isVector2d(data.target)) {
      const targetPort = this.context.cellsDataMap.get(
        data.target as string
      ) as PortDataType;
      target = this.context.cellsDataMap.get(targetPort.host as string);
    }

    return {
      source,
      target,
    };
  }

  // 这个方法暴露出去，可自定义路由
  route(vectors: Vector2d[]) {
    return vectors;
  }

  private vectorsToPoints(vectors: Vector2d[]) {
    const re: [number, number][] = [];
    vectors.forEach((vector) => {
      re.push([vector.x, vector.y]);
    });

    return re;
  }

  getPointAt = (ratio: number) => {
    this.pathInstance.setAttribute("d", this.getBazierPath());
    return this.pathInstance.getPointAtLength(
      ratio * this.pathInstance.getTotalLength()
    );
  }

  labelContent = () => {
    const {
      color,
      refs: { svgContainerRef },
    } = this.context;

    const text = this.label(this.data.label);
    if (!text) return <></>;

    const props = {
      dominantBaseline: "hanging",
    };
    const textInstance = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    textInstance.innerHTML = text;

    (svgContainerRef as SVGElement).appendChild(textInstance);
    const textBounds = textInstance.getBBox();
    (svgContainerRef as SVGElement).removeChild(textInstance);

    return (
      <g
        transform={`translate(${-(textBounds.width + LABEL_PADDING) / 2}, ${-(TEXT_HEIGHT + LABEL_PADDING) / 2
          })`}
      >
        <rect
          width={textBounds.width + LABEL_PADDING * 2}
          height={TEXT_HEIGHT + LABEL_PADDING * 2}
          fill="white"
        ></rect>
        <text x={LABEL_PADDING} y={LABEL_PADDING} {...props}>
          {text}
        </text>
      </g>
    );
  }

  label(label: string) {
    return label;
  }

  isLinking = () => {
    return this.state.isLinking;
  }

  getBazierDir = () => {
    const { source, target } = this.getAnchors();
    const LENGTH = (target.x - source.x) * 0.5;

    return {
      source: [LENGTH, 0],
      target: [-LENGTH, 0],
    } as { source: Dir; target: Dir };
  }

  getBazierPath = () => {
    const { source, target } = this.getAnchors();
    const dir = this.getBazierDir();

    return `M${source.x},${source.y} 
    C${source.x + dir.source[0]},${source.y + dir.source[1]} ${target.x + dir.target[0]
      },${target.y + dir.target[1]} 
    ${target.x},${target.y}`;
  }

  getPolylinePath = () => {
    const points = this.getPoints();

    let str = `M${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      str += `L${points[i][0]},${points[i][1]}`;
    }

    return str;
  }

  @computed
  get d() {
    return callIfFn(this.bazier)
      ? this.getBazierPath()
      : this.getPolylinePath();
  }
}

const DEFAULT_ARROW_SIZE = 4;

export const Edge: React.FC<{ model: EdgeModel }> = observer(({ model }) => {
  const Line = observer(() => {
    const context = useContext(FlowContext);
    const { color } = context;
    const { d, isSelect } = model;

    const lineProps = {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none",
      strokeWidth: 2,
      stroke: isSelect ? color.active : color.deepGrey,
    } as any;

    const { cos, sin, PI } = Math;
    const arrowOffset = [
      lineProps.strokeWidth / 2 || 0,
      lineProps.strokeWidth / 2 || 0,
    ];

    return (
      <>
        <defs>
          <marker
            id="arrow-end"
            markerWidth="100"
            markerHeight="100"
            refX={arrowOffset[0] + DEFAULT_ARROW_SIZE * cos(PI / 6)}
            refY={arrowOffset[1] + DEFAULT_ARROW_SIZE * sin(PI / 6)}
            orient="auto"
          >
            <path
              {...lineProps}
              d={`M${arrowOffset[0]},${arrowOffset[1]} L${arrowOffset[0]},${DEFAULT_ARROW_SIZE * sin(PI / 6) * 2 + arrowOffset[1]
                } L${DEFAULT_ARROW_SIZE * cos(PI / 6) + arrowOffset[0]},${DEFAULT_ARROW_SIZE * sin(PI / 6) + arrowOffset[1]
                } Z`}
            />
          </marker>
        </defs>
        <path
          {...lineProps}
          d={d}
          markerEnd="url(#arrow-end)"
        />
      </>
    );
  });

  const Label = observer(() => {
    const text = model.label(model.data.label);
    const position = model.getPointAt(0.5);

    return (
      <>
        {text && model.labelContent() && <g
          ref={(label) => {
            if (model.isMountEvents || !label) return;
            model.isMountEvents = true;
          }}
          transform={`translate(${position.x}, ${position.y})`}
        >
          {model.labelContent()}
        </g>}
      </>
    );
  });

  return (
    <>
      {/* 这个函数的返回只能返回 React.createElement(Line)，并没有收集model的依赖 */}
      <Line></Line>
      <Label></Label>
    </>
  );
});
