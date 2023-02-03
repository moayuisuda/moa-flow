import { Bounds } from '../typings/common';
import { isUndefined, isFunction } from 'lodash';
export const arrayMove = <T>(arr: T[], oldIndex: number, newIndex: number) => {
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
}

export const findIndex = (arr: any[], target: any) => {
    let curr
    for (let i = 0; i < arr.length; i++) {
        curr = arr[i]
        if (curr === target) return i
    }

    return undefined
}

export const remove = (arr: any[], target: any) => {
    const index = findIndex(arr, target) as number
    !isUndefined(index) && arr.splice(index, 1)
}

export const isRectsInterSect = (boundsA: Bounds, boundsB: Bounds) => {
    return !(
        boundsA.x + boundsA.width < boundsB.x ||
        boundsA.x > boundsB.x + boundsB.width ||
        boundsA.y + boundsA.height < boundsB.y ||
        boundsA.y > boundsB.y + boundsB.height
    )
}

export const isVector2d = (source: any) => {
    return typeof source !== 'string'
}

export const callIfFn = (exp: any) => {
    if (isFunction(exp)) return exp();
    else return exp;
}

export const stopPortalEvents = {
    onMouseMove: (e: any) => {
        e.stopPropagation()
    },
    onMouseDown: (e: any) => {
        e.stopPropagation()
    },
    onMouseUp: (e: any) => {
        e.stopPropagation()
    }
}