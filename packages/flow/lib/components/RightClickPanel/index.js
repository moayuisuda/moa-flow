import { __decorate } from '../../node_modules/tslib/tslib.es6.js';
import { observer } from 'mobx-react';
import styles from './style.less.js';
import React from 'react';
import { FlowContext } from '../../Context.js';

let RightClickPanel = class RightClickPanel extends React.Component {
    constructor(props) {
        super(props);
        this.initStageEvent = () => {
            this.context.refs.stageRef.current.on("contextmenu", (e) => {
                e.preventDefault();
                this.context.buffer.rightClickPanel.visible = true;
                this.setState({
                    pos: {
                        x: e.clientX,
                        y: e.clientY,
                    },
                });
            });
        };
        this.state = {
            pos: {
                x: 0,
                y: 0,
            },
        };
    }
    componentDidMount() {
        // 子组件会在commit阶段先挂载触发didMount
        Promise.resolve().then(() => {
            this.initStageEvent();
        });
    }
    dele() { }
    moveToTop() { }
    render() {
        if (!this.context.buffer.rightClickPanel.visible)
            return React.createElement(React.Fragment, null);
        console.log(this.props.children);
        return (React.createElement("div", { style: {
                top: this.state.pos.y,
                left: this.state.pos.x,
            }, className: styles["toolbar"] }, this.props.children(this.context)));
    }
};
RightClickPanel.contextType = FlowContext;
RightClickPanel = __decorate([
    observer
], RightClickPanel);
const getRightClickPanel = (children) => {
    return React.Children.toArray(children).find((item) => {
        return item.type === RightClickPanel;
    });
};
var RightClickPanel$1 = RightClickPanel;

export { RightClickPanel$1 as default, getRightClickPanel };
