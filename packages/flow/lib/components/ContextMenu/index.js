import { __extends, __decorate } from '../../node_modules/tslib/tslib.es6.js';
import { observer } from 'mobx-react';
import styles from './style.less.js';
import React from 'react';
import { FlowContext } from '../../Context.js';
import { STAGE_ID } from '../../constants.js';

var ContextMenu = /** @class */ (function (_super) {
    __extends(ContextMenu, _super);
    function ContextMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.initStageEvent = function () {
            var _a;
            (_a = document
                .querySelector("#" + STAGE_ID)) === null || _a === void 0 ? void 0 : _a.addEventListener("contextmenu", function (e) {
                e.preventDefault();
                _this.context.contextMenuVisible = true;
                _this.setState({
                    pos: {
                        x: e.clientX,
                        y: e.clientY,
                    },
                });
            });
        };
        _this.state = {
            pos: {
                x: 0,
                y: 0,
            },
        };
        return _this;
    }
    ContextMenu.prototype.componentDidMount = function () {
        var _this = this;
        // 子组件会在commit阶段先挂载触发didMount
        Promise.resolve().then(function () {
            _this.initStageEvent();
        });
    };
    ContextMenu.prototype.render = function () {
        if (!this.context.contextMenuVisible)
            return React.createElement(React.Fragment, null);
        return (React.createElement("div", { style: {
                top: this.state.pos.y,
                left: this.state.pos.x,
            }, className: styles["toolbar"] }, this.props.children));
    };
    ContextMenu.contextType = FlowContext;
    ContextMenu = __decorate([
        observer
    ], ContextMenu);
    return ContextMenu;
}(React.Component));
var getContextMenu = function (children) {
    return React.Children.toArray(children).find(function (item) {
        return item.type === ContextMenu;
    });
};

export { ContextMenu, getContextMenu };
