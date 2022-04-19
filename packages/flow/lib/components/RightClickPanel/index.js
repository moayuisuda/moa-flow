import { __extends, __decorate } from '../../node_modules/tslib/tslib.es6.js';
import { observer } from 'mobx-react';
import styles from './style.less.js';
import React from 'react';
import { FlowContext } from '../../Context.js';

var RightClickPanel = /** @class */ (function (_super) {
    __extends(RightClickPanel, _super);
    function RightClickPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.initStageEvent = function () {
            _this.context.refs.stageRef.current.on("contextmenu", function (e) {
                e.evt.preventDefault();
                _this.context.buffer.rightClickPanel.visible = true;
                _this.setState({
                    pos: {
                        x: e.evt.clientX,
                        y: e.evt.clientY,
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
    RightClickPanel.prototype.componentDidMount = function () {
        var _this = this;
        // 子组件会在commit阶段先挂载触发didMount
        Promise.resolve().then(function () {
            _this.initStageEvent();
        });
    };
    RightClickPanel.prototype.dele = function () { };
    RightClickPanel.prototype.moveToTop = function () { };
    RightClickPanel.prototype.render = function () {
        if (!this.context.buffer.rightClickPanel.visible)
            return React.createElement(React.Fragment, null);
        return (React.createElement("ul", { style: {
                top: this.state.pos.y,
                left: this.state.pos.x,
            }, className: styles["toolbar"] }));
    };
    RightClickPanel.contextType = FlowContext;
    RightClickPanel = __decorate([
        observer
    ], RightClickPanel);
    return RightClickPanel;
}(React.Component));
var getRightClickPanel = function (children) {
    return React.Children.toArray(children).find(function (item) {
        return item.type === RightClickPanel;
    });
};

export { RightClickPanel as default, getRightClickPanel };
