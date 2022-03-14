import { ModelType } from 'flow'

type ModelRefType = React.MutableRefObject<ModelType | undefined | null>;

// 统一约束可以分包
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
            const edges = []

            if (nodeData.ports) {
                nodeData.ports.forEach(port => {
                    edges.push(...model.getPortEdges(port.id))
                });
            }

            for (let edge of edges) {
                model.deleCell(edge);
            }

            return {
                result: model.selectCells[0]
            }
        }
    }
}

export default MatrixCommand