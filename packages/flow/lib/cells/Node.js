import { __extends } from '../node_modules/tslib/tslib.es6.js';
import Cell from './Cell.js';

var Node = /** @class */ (function (_super) {
    __extends(Node, _super);
    function Node() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Node.metaData = {
        x: 0,
        y: 0,
        cellType: "node",
    };
    return Node;
}(Cell));

export { Node as default };
