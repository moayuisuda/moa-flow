import { Group, Rect, Text } from 'react-konva';
import { useContext } from 'react';
import { FlowContext } from '../Context.js';

const Button = (props) => {
    const { x = 0, y = 0, width = 100, height = 30 } = props;
    const { color } = useContext(FlowContext);
    return (React.createElement(Group, { x: x, y: y, onClick: props.onClick },
        React.createElement(Rect, { shadowBlur: 10, shadowOpacity: 0.1, cornerRadius: 4, fill: color.active, width: width, height: height }),
        React.createElement(Text, { stroke: "white", text: props.text, width: width, height: height, align: "center", verticalAlign: "middle" })));
};

export { Button as default };
