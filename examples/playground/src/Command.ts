import { ModelType } from "flow";
type ModelRefType = React.MutableRefObject<ModelType | undefined | null>;

type CommandResultType = {
    error?: {
        message: string
    };
    result?: any;
}

class Command {
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
            const id = modelRef.current?.deleCell(modelRef.current?.selectCells[0]);
            return { result: id }
        }


    }
}

export { Command }