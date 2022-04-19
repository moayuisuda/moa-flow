import { Group, Rect, Text } from 'react-konva';
import { useContext } from 'react';
import { FlowContext } from '../Context.js';

var Button = function (props) {
    var _a = props.x, x = _a === void 0 ? 0 : _a, _b = props.y, y = _b === void 0 ? 0 : _b, _c = props.width, width = _c === void 0 ? 100 : _c, _d = props.height, height = _d === void 0 ? 30 : _d;
    var color = useContext(FlowContext).color;
    return (React.createElement(Group, { x: x, y: y, onClick: props.onClick },
        React.createElement(Rect, { shadowBlur: 10, shadowOpacity: 0.1, cornerRadius: 4, fill: color.active, width: width, height: height }),
        React.createElement(Text, { stroke: "white", text: props.text, width: width, height: height, align: "center", verticalAlign: "middle" })));
};

export { Button as default };
