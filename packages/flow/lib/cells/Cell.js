import React from 'react';
import { Group } from 'react-konva';
import { FlowContext } from '../Context.js';
import '../node_modules/lodash/lodash.js';
import { observer } from 'mobx-react';
import { titleCase } from '../utils/string.js';
import { l as lodash } from '../_virtual/lodash.js';

// D: data, S: state, P: props
class Cell extends React.Component {
    constructor(props, context) {
        super(props);
        context.cellsMap.set(props.data.id, this);
        this.wrapperRef = React.createRef();
    }
    static regist(name, model) {
        model.componentsMap.set(name, this);
    }
    static getMetaData() {
        const re = {};
        let curr = this;
        // 合并父类metaData
        while (curr !== React.Component) {
            Object.assign(re, curr.metaData);
            curr = curr.__proto__;
        }
        return lodash.exports.cloneDeep(re);
    }
    getStage() {
        var _a;
        return (_a = this.context.refs.stageRef) === null || _a === void 0 ? void 0 : _a.current;
    }
    setData(data) {
        this.context;
        this.context.setCellData(this.props.data.id, data);
    }
    componentDidMount() {
        [
            "mouseenter",
            "mouseleave",
            "mousedown",
            "mouseup",
            "dblclick",
            "click",
        ].forEach((eventName) => {
            this.wrapperRef.current.on(eventName, (e) => {
                const instanceEventFn = this[`on${titleCase(eventName)}`];
                instanceEventFn && instanceEventFn.call(this, e);
                this.context.sendEvent({
                    type: `cell:${eventName}`,
                    data: {
                        e,
                        cellData: this.props.data,
                        cell: this,
                    },
                });
            });
        });
        this.onMount && this.onMount();
    }
    getData() {
        return this.props.data;
    }
    isSelect() {
        console.log("asd");
        return this.props.data.$state.isSelect;
    }
    render() {
        return React.createElement(Group, { ref: this.wrapperRef }, this.content());
    }
}
Cell.contextType = FlowContext;
Cell.metaData = { id: "" };
var Cell$1 = observer(Cell);

export { Cell$1 as default };
