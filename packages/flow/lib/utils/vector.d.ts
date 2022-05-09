export declare const add: (vectorA: any, vectorB: any) => any[];
export declare const multiply: (vector: any, k: any) => number[];
export declare const vectorFromPoints: (pointA: any, pointB: any) => number[];
export declare const isParallel: (vectorA: any, vectorB: any) => boolean;
export declare const dot: (vectorA: any, vectorB: any) => number;
export declare const cross: (vectorA: any, vectorB: any) => number;
export declare const angleFrom: (vector: any) => number;
export declare const getUnitVector: (vector: any) => number[];
export declare const equals: (vector: any, target: any) => boolean;
declare function generateConnectionPoints({ entryPoint, entryDirection, entryExt, exitPoint, exitDirection, exitExt }: {
    entryPoint?: number[] | undefined;
    entryDirection?: number[] | undefined;
    entryExt?: number | undefined;
    exitPoint?: number[] | undefined;
    exitDirection?: number[] | undefined;
    exitExt?: number | undefined;
}, turnRatio?: number): ({
    position: number[];
    direction: null;
    type?: undefined;
} | {
    position: any[];
    direction: false | number[];
    type?: undefined;
} | {
    position: any[];
    direction: false | number[];
    type: string;
})[];
export default generateConnectionPoints;
export declare const lineCenter: (points: [number, number][], intercept?: number) => number[] | undefined;
