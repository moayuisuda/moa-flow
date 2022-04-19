import { Bounds } from '../types/common';
export const arrayMove = <T>(arr: T[], oldIndex: number, newIndex: number) => {
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
}

export const findIndex = (arr: [], target: any) => {
    let curr
    for (let i = 0; i < arr.length; i++) {
        curr = arr[i]
        if (curr === target) return i
    }

    return undefined
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