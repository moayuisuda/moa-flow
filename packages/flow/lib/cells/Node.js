import { __extends } from '../node_modules/tslib/tslib.es6.js';
import { CellModel } from './Cell.js';

var NodeModel = /** @class */ (function (_super) {
    __extends(NodeModel, _super);
    function NodeModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NodeModel.prototype.getLinkNodes = function () {
        return this.context.getLinkNodes(this.data.id);
    };
    NodeModel.prototype.getLinkPorts = function () {
        return this.context.getLinkPorts(this.data.id);
    };
    NodeModel.prototype.getNodeEdges = function () {
        return this.context.getNodeEdges(this.data.id);
    };
    NodeModel.prototype.getPosition = function () {
        return this.context.getNodePosition(this.data.id);
    };
    NodeModel.prototype.getChildren = function () {
        var _this = this;
        return this.context.canvasData.cells.filter(function (cellData) {
            cellData.parent === _this.data.id;
        });
    };
    NodeModel.defaultData = {
        x: 0,
        y: 0,
        id: "",
        component: "",
        cellType: "node",
    };
    return NodeModel;
}(CellModel));
// @TODO
// type BizParams = {
//   name: string;
//   age: number;
// };
// class Base<T> {
//   param: T;
//   constructor() {}
// }
// class Biz extends Base<{ name: string; age: number }> {
//   constructor() {
//     super();
//   }
// }
// const map: Record<string, typeof Base> = {
//   Biz: Biz,
// };

export { NodeModel };
