import { ModelType } from '@ali/flow-infra';
declare type ModelRefType = React.MutableRefObject<ModelType | undefined | null>;
declare type CommandResultType = {
    error?: {
        message: string;
    };
    result?: any;
};
declare class MatrixCommand {
    modelRef: ModelRefType;
    constructor(modelRef: ModelRefType);
    dele(): CommandResultType;
    deleEdges(): CommandResultType;
}
export default MatrixCommand;
