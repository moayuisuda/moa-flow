import { __extends, __assign } from '../node_modules/tslib/tslib.es6.js';
import React from 'react';
import { Group } from 'react-konva';
import Konva from 'konva';
import { FlowContext } from '../Context.js';
import '../node_modules/lodash/lodash.js';
import { observer } from 'mobx-react';
import { l as lodash } from '../_virtual/lodash.js';

// D: data, S: state, P: props
var Cell = /** @class */ (function (_super) {
    __extends(Cell, _super);
    function Cell(props, context) {
        var _this = _super.call(this, props) || this;
        context.cellsMap.set(props.data.id, _this);
        _this.flowState = {
            isSelect: false,
        };
        _this.wrapperRef = React.createRef();
        return _this;
    }
    Cell.regist = function (model) {
        model.componentsMap.set(this.name, this);
    };
    Cell.getMetaData = function () {
        var re = {};
        var curr = this;
        var componentName = this.name;
        // 合并父类metaData
        while (curr !== React.Component) {
            Object.assign(re, curr.metaData);
            curr = curr.__proto__;
        }
        return __assign(__assign({}, lodash.exports.cloneDeep(re)), { component: componentName });
    };
    Cell.prototype.getStage = function (konvaNode) {
        var re = konvaNode;
        while (re.__proto__.constructor !== Konva.Stage) {
            re = re.parent;
        }
        return re;
    };
    Cell.prototype.setData = function (data) {
        this.context;
        this.context.setCellData(this.props.data.id, data);
    };
    Cell.prototype.componentDidMount = function () {
        var _this = this;
        [
            "mouseenter",
            "mouseleave",
            "mousedown",
            "mouseup",
            "dblclick",
            "click",
        ].forEach(function (eventName) {
            _this.wrapperRef.current.on(eventName, function (e) {
                _this.context.sendEvent({
                    type: "cell:".concat(eventName),
                    data: {
                        e: e,
                        cellData: _this.props.data,
                    },
                });
            });
        });
    };
    Cell.prototype.isSelect = function () {
        return this.flowState.isSelect;
    };
    Cell.prototype.render = function () {
        return React.createElement(Group, { ref: this.wrapperRef }, this.content());
    };
    Cell.contextType = FlowContext;
    Cell.metaData = { id: "" };
    return Cell;
}(React.Component));
var Cell$1 = observer(Cell);

export { Cell$1 as default };
