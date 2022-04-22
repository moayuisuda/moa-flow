import Cell from './Cell.js';

class Node extends Cell {
}
Node.metaData = {
    x: 0,
    y: 0,
    cellType: "node",
};

export { Node as default };
