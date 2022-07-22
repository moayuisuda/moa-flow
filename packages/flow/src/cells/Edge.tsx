import { Dir, Vector2d } from "../typings/common";
import { PortDataType } from "../components";
import React from "react";
import { isVector2d, lineCenter } from "../utils";
import { callIfFn } from "../utils/util";
import { Arrow } from "../components";
import { CellModel, CellDataType } from "./Cell";
import { useContext } from "react";
import { FlowContext } from "../Context";
import { FlowModel } from "Model";
import { useObserver } from "mobx-react";
import { observer } from "mobx-react-lite";

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
  static defaultData: EdgeDataType = {
    id: "",
    component: "Edge", // 这里一般会被重置为FLowEdge这种业务类的线条
    source: "",
    target: "",
    label: "",
    verticies: [],
    cellType: "edge",
  };

  data: EdgeDataType;

  labelRef: React.RefObject<SVGTextElement>;
  arrowRef: React.RefObject<Arrow>;

  protected bazier: boolean | (() => boolean) = true;
  protected startHead: Head | (() => Head) = false;
  protected endHead: Head | (() => Head) = true;
  lineDash: [number, number] | (() => [number, number]) = [0, 0];
  protected animate: boolean | (() => boolean) = false;

  pathInstance = document.createElementNS("http://www.w3.org/2000/svg", "path");

  isMountEvents = false;

  constructor(data: any, context: FlowModel) {
    super(data, context);
    this.labelRef = React.createRef();
    this.arrowRef = React.createRef();
  }

  lineStyle({ isSelect }: { isSelect: boolean }) {
    const { color } = this.context;

    if (isSelect) {
      return {
        stroke: color.active,
      };
    } else return {};
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

  private getPoints() {
    const routeResult = this.route(this.getVectors());

    return this.vectorsToPoints(routeResult);
  }

  getVectors() {
    const anchors = this.getAnchors();
    const verticies = this.data.verticies || [];

    return [anchors.source, ...verticies, anchors.target];
  }

  getLinkNodesData() {
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
  protected route(vectors: Vector2d[]) {
    return vectors;
  }

  private vectorsToPoints(vectors: Vector2d[]) {
    const re: [number, number][] = [];
    vectors.forEach((vector) => {
      re.push([vector.x, vector.y]);
    });

    return re;
  }

  labelContent() {
    const {
      color,
      refs: { svgRef },
    } = this.context;

    const text = this.labelFormatter(this.data.label);
    if (!text) return <></>;

    const props = {
      dominantBaseline: "hanging",
      ...this.labelStyle(),
    };
    const textInstance = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    textInstance.innerHTML = text;

    (svgRef as SVGElement).appendChild(textInstance);
    const textBounds = textInstance.getBBox();
    (svgRef as SVGElement).removeChild(textInstance);

    return (
      <g
        x={-(textBounds.width + LABEL_PADDING) / 2}
        y={-(TEXT_HEIGHT + LABEL_PADDING) / 2}
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

  labelStyle() {
    return {};
  }

  labelFormatter(label: string) {
    return "label + asd";
  }

  isLinking() {
    return this.state.isLinking;
  }

  getBazierDir(): { source: Dir; target: Dir } {
    const { source, target } = this.getAnchors();
    const LENGTH = (target.x - source.x) * 0.5;

    return {
      source: [LENGTH, 0],
      target: [-LENGTH, 0],
    };
  }

  getBazierPath() {
    const { source, target } = this.getAnchors();
    const dir = this.getBazierDir();

    return `M${source.x},${source.y} 
    C${source.x + dir.source[0]},${source.y + dir.source[1]} ${
      target.x + dir.target[0]
    },${target.y + dir.target[1]} 
    ${target.x},${target.y}`;
  }

  labelPosition() {
    if (callIfFn(this.bazier)) {
      this.pathInstance.setAttribute("d", this.getBazierPath());
      console.log(this.pathInstance);

      return this.pathInstance.getPointAtLength(
        this.pathInstance.getTotalLength() / 2
      );
    } else {
      const points = this.getVectors().map((vector) => [
        vector.x,
        vector.y,
      ]) as [number, number][];
      const lineLenthCenter = lineCenter(points);

      return {
        x: lineLenthCenter[0] || points[0][0],
        y: lineLenthCenter[1] || points[0][1],
      };
    }
  }

  getPolylinePath() {
    const points = this.getPoints();

    let str = `M${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      str += `L${points[i][0]},${points[i][1]}`;
    }

    return str;
  }

  getPath() {
    return callIfFn(this.bazier)
      ? this.getBazierPath()
      : this.getPolylinePath();
  }
}

export const Edge: React.FC<{ model: EdgeModel }> = observer(({ model }) => {
  const Line = observer(() => {
    const context = useContext(FlowContext);
    const { color } = context;

    const lineProps = {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none",
      strokeWidth: 3,
      stroke: color.deepGrey,
      ...model.lineStyle({ isSelect: model.isSelect }),
    } as any;

    return (
      <path
        ref={model.arrowRef}
        {...lineProps}
        d={model.getPath()}
        // startHead={callIfFn(this.startHead)}
        // endHead={callIfFn(this.endHead)}
        strokeDasharray={callIfFn(model.lineDash)}
      />
    );
  });

  const Label = observer(() => {
    const text = model.labelFormatter(model.data.label);
    const position = model.labelPosition();
    console.log(`trasnlate(${position.x}, ${position.y})`);

    return (
      <g
        ref={(label) => {
          if (model.isMountEvents || !label) return;
          model.isMountEvents = true;
        }}
        transform={`translate(${position.x}, ${position.y})`}
      >
        {text && model.labelContent()}
      </g>
    );
  });

  return (
    <g>
      {/* 这个函数的返回只能返回 React.createElement(Line)，并没有收集model的依赖 */}
      <Line></Line>
      <Label></Label>
    </g>
  );
});
