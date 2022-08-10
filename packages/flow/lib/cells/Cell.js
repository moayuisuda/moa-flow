import { __decorate } from '../node_modules/tslib/tslib.es6.js';
import { observable, computed, action, makeObservable } from 'mobx';

var CellModel = /** @class */ (function () {
    function CellModel(data, context) {
        this.state = {
            isSelect: false,
            isLinking: false,
        };
        this.data = data;
        this.context = context;
        makeObservable(this);
    }
    Object.defineProperty(CellModel.prototype, "isSelect", {
        get: function () {
            return this.state.isSelect;
        },
        set: function (isSelect) {
            this.state.isSelect = isSelect;
        },
        enumerable: false,
        configurable: true
    });
    CellModel.prototype.getWrapperRef = function () {
        return this.context.getWrapperRef(this.data.id);
    };
    CellModel.prototype.setData = function (data, rec) {
        if (rec === void 0) { rec = true; }
        this.context.setCellData(this.data.id, data, rec);
    };
    CellModel.defaultData = {
        id: "",
        component: "",
        cellType: "",
    };
    __decorate([
        observable
    ], CellModel.prototype, "data", void 0);
    __decorate([
        observable
    ], CellModel.prototype, "state", void 0);
    __decorate([
        computed
    ], CellModel.prototype, "isSelect", null);
    __decorate([
        action
    ], CellModel.prototype, "setData", null);
    return CellModel;
}());

export { CellModel };
