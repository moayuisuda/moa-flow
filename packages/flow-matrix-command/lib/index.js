var MatrixCommand = /** @class */ (function () {
    function MatrixCommand(modelRef) {
        this.modelRef = modelRef;
    }
    MatrixCommand.prototype.dele = function () {
        var _a, _b, _c;
        var modelRef = this.modelRef;
        if (!((_a = modelRef.current) === null || _a === void 0 ? void 0 : _a.selectCells[0])) {
            return {
                error: {
                    message: '请先选择画布中的元素'
                }
            };
        }
        else {
            for (var _i = 0, _d = (_b = modelRef.current) === null || _b === void 0 ? void 0 : _b.selectCells; _i < _d.length; _i++) {
                var node = _d[_i];
                (_c = modelRef.current) === null || _c === void 0 ? void 0 : _c.deleCell(node);
            }
            return { result: '' };
        }
    };
    MatrixCommand.prototype.deleEdges = function () {
        var model = this.modelRef.current;
        if (model.selectCells.length > 1) {
            return {
                error: {
                    message: '至多选择一个节点'
                }
            };
        }
        else {
            var nodeData = model.cellsDataMap.get(model.selectCells[0]);
            var edges_2 = [];
            if (nodeData.ports) {
                nodeData.ports.forEach(function (port) {
                    edges_2.push.apply(edges_2, model.getPortEdges(port.id));
                });
            }
            for (var _i = 0, edges_1 = edges_2; _i < edges_1.length; _i++) {
                var edge = edges_1[_i];
                model.deleCell(edge);
            }
            return {
                result: model.selectCells[0]
            };
        }
    };
    return MatrixCommand;
}());

export { MatrixCommand as default };
