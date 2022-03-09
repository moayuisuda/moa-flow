export const arrayMove = <T>(arr: T[], oldIndex: number, newIndex: number) => {
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
}

export const findIndex = (arr, target) => {
    let curr
    for (let i = 0; i < arr.length; i++) {
        curr = arr[i]
        if (curr === target) return i
    }
}