import { EdgeModel, LineType, FlowModel, Port } from "moa-flow";
import React from "react";
import { expect } from "chai";
// @ts-ignore
import jsdom from "mocha-jsdom";
import { describe } from "mocha";

describe("EdgeModel", () => {
  jsdom({
    url: "http://localhost/",
  });

  const MOCK_DATA = {
    sourcePort: {
      data: {
        id: "port-0",
        host: "node-0",
        cellType: "port",
        component: "Port",
      },
      anchor: () => ({
        x: 100,
        y: 100,
      }),
    },
    targetPort: {
      data: {
        id: "port-1",
        host: "node-0",
        cellType: "port",
        component: "Port",
      },
      anchor: () => ({
        x: 100,
        y: 100,
      }),
    },
    node: {
      id: "node-0",
      x: 100,
      y: 100,
      ports: [{ id: "port-0" }],
    },
  };

  let context: FlowModel;
  beforeEach(() => {
    context = new FlowModel();
    // @ts-ignore
    context.cellsDataMap.set(MOCK_DATA.node.id, MOCK_DATA.node);
    // @ts-ignore
    context.portInstanceMap.set(
      MOCK_DATA.sourcePort.data.id,
      new Port(MOCK_DATA.sourcePort as any, context)
    );
    // @ts-ignore
    context.portInstanceMap.set(
      MOCK_DATA.targetPort.data.id,
      new Port(MOCK_DATA.targetPort as any, context)
    );
  });

  it("get correct path data with different lineType", () => {
    // POLYLINE
    class PolylineEdgeModel extends EdgeModel {
      lineType = LineType.POLYLINE;
    }
    const vertex = { x: 25, y: 25 };
    const polyEdgeModel = new PolylineEdgeModel(
      context.getFullCellData("Edge", {
        source: "port-0",
        target: "port-1",
        vertices: [vertex],
      }),
      context
    );

    expect(polyEdgeModel.d).includes(`L${vertex.x},${vertex.y}`);

    // BAZIER
    class BazierEdgeModel extends EdgeModel {
      lineType = LineType.BEZIER;
    }
    const bezierEdgeModel = new BazierEdgeModel(
      context.getFullCellData("Edge", {
        source: "port-0",
        target: "port-1",
      }),
      context
    );
    expect(bezierEdgeModel.d).includes("C");

    // ORTH
    class OrthEdgeModel extends EdgeModel {
      lineType = LineType.ORTH;
    }
    const orthEdgeModel = new OrthEdgeModel(
      context.getFullCellData("Edge", {
        source: "port-0",
        target: "port-1",
        vertices: [vertex],
      }),
      context
    );
    expect(orthEdgeModel.d).not.includes(vertex.x);
  });
});
