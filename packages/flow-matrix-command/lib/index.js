var CommonCommand = /** @class */ (function () {
    function CommonCommand(modelRef) {
        this.modelRef = modelRef;
    }
    CommonCommand.prototype.dele = function () {
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
    return CommonCommand;
}());

export { CommonCommand as default };
