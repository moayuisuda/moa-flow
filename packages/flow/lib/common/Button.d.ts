/// <reference types="react" />
declare type ButtonProps = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    text: string;
    onClick: (e: any) => void;
};
declare const Button: (props: ButtonProps) => JSX.Element;
export default Button;
