import { ModelType } from '@ali/flow-infra'

// 提供具体的行为实现，相当于 react-dom

type ModelRefType = React.MutableRefObject<ModelType | undefined | null>;

// 提供抽象的行为，相当于 react-reconciler，需要分包
type CommandResultType = {
    error?: {
        message: string
    };
    result?: any;
}

class MatrixCommand {
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

    deleEdges(): CommandResultType {
        const model = this.modelRef.current

        if (model.selectCells.length > 1) {
            return {
                error: {
                    message: '至多选择一个节点'
                }
            }
        } else {
            const nodeData = model.cellsDataMap.get(model.selectCells[0])

            for (let edge of model.getNodeEdges(nodeData.id)) {
                model.deleCell(edge);
            }

            return {
                result: model.selectCells[0]
            }
        }
    }
}

export default MatrixCommand