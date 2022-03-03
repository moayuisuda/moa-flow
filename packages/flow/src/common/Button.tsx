import { Text, Rect, Group } from "react-konva";
import { useContext } from "react";
import { FlowContext } from "@/Context";

type ButtonProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text: string;
  onClick: (e) => void;
};

const Button = (props: ButtonProps) => {
  const { x = 0, y = 0, width = 100, height = 30 } = props;
  const {
    model: { color },
  } = useContext(FlowContext);

  return (
    <Group x={x} y={y} onClick={props.onClick}>
      <Rect
        shadowBlur={10}
        shadowOpacity={0.1}
        cornerRadius={4}
        fill={color.active}
        width={width}
        height={height}
      />
      <Text
        stroke="white"
        text={props.text}
        width={width}
        height={height}
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
};

export default Button;
