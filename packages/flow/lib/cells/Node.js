import { __extends } from '../node_modules/tslib/tslib.es6.js';
import Cell from './Cell.js';

var Node = /** @class */ (function (_super) {
    __extends(Node, _super);
    function Node() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Node.prototype.getLinkNodes = function () {
        return this.context.getLinkNodes(this.props.data.id);
    };
    Node.prototype.getLinkPorts = function () {
        return this.context.getLinkPorts(this.props.data.id);
    };
    Node.prototype.getNodeEdges = function () {
        return this.context.getNodeEdges(this.props.data.id);
    };
    Node.prototype.getPosition = function () {
        return this.context.getNodePosition(this.getData().id);
    };
    Node.prototype.getChildren = function () {
        var _this = this;
        return this.context.canvasData.cells.filter(function (cellData) {
            cellData.parent === _this.getData().id;
        });
    };
    Node.metaData = {
        x: 0,
        y: 0,
        cellType: "node",
    };
    return Node;
}(Cell));

export { Node as default };
