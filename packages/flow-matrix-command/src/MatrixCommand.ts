import { ModelType } from 'flow'

type ModelRefType = React.MutableRefObject<ModelType | undefined | null>;

// 统一约束可以分包
type CommandResultType = {
    error?: {
        message: string
    };
    result?: any;
}

class CommonCommand {
    modelRef: ModelRefType

    constructor(modelRef: ModelRefType) {
        this.modelRef = modelRef
    }

    dele(): CommandResultType {
        const { modelRef } = this

        if (!modelRef.current?.selectCells[0]) {
            return {
                error: {
                    message: '请先选择画布中的元素'
                }
            }
        }
        else {
            for (let node of modelRef.current?.selectCells) {
                modelRef.current?.deleCell(node);
            }
            return { result: '' }
        }
    }
}

export default CommonCommand