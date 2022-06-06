import { __extends } from '../node_modules/tslib/tslib.es6.js';
import React from 'react';
import { Group } from '@antv/react-g';
import { FlowContext } from '../Context.js';
import '../node_modules/lodash/lodash.js';
import { observer } from 'mobx-react';
import { titleCase } from '../utils/string.js';
import { l as lodash } from '../_virtual/lodash.js';

// D: data, S: state, P: props
var Cell = /** @class */ (function (_super) {
    __extends(Cell, _super);
    function Cell(props, context) {
        var _this = _super.call(this, props) || this;
        context.cellsMap.set(props.data.id, _this);
        _this.wrapperRef = React.createRef();
        return _this;
    }
    Cell.prototype.onMount = function () { };
    Cell.regist = function (name, model) {
        model.componentsMap.set(name, this);
    };
    Cell.getMetaData = function () {
        var re = {};
        var curr = this;
        // 合并父类metaData
        while (curr !== React.Component) {
            Object.assign(re, curr.metaData);
            curr = curr.__proto__;
        }
        return lodash.exports.cloneDeep(re);
    };
    Cell.prototype.setData = function (data) {
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
                var instanceEventFn = _this["on".concat(titleCase(eventName))];
                instanceEventFn && instanceEventFn.call(_this, e);
                _this.context.emitEvent({
                    type: "cell:".concat(eventName),
                    data: {
                        e: e,
                        cellData: _this.props.data,
                        cell: _this,
                    },
                });
            });
        });
        this.onMount && this.onMount();
    };
    Cell.prototype.getData = function () {
        return this.props.data;
    };
    Cell.prototype.isSelect = function () {
        return this.props.data.$state.isSelect;
    };
    Cell.prototype.render = function () {
        var _this = this;
        return (React.createElement(Group, { ref: function (ref) {
                _this.wrapperRef.current = ref;
            } }, lodash.exports.isUndefined(this.props.data.visible) || this.props.data.visible ? (React.createElement(Group, null, this.content())) : (React.createElement(React.Fragment, null))));
    };
    Cell.contextType = FlowContext;
    Cell.metaData = { id: "" };
    return Cell;
}(React.Component));
var Cell$1 = observer(Cell);

export { Cell$1 as default };
