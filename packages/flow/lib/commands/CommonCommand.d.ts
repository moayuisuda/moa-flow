/// <reference types="react" />
import Model from '../Model';
declare type ModelRefType = React.MutableRefObject<Model | undefined | null>;
declare type CommandResultType = {
    error?: {
        message: string;
    };
    result?: any;
};
declare class CommonCommand {
    modelRef: ModelRefType;
    constructor(modelRef: ModelRefType);
    dele(): CommandResultType;
}
export default CommonCommand;
