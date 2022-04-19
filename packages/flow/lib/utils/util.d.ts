import { Bounds } from '../types/common';
export declare const arrayMove: <T>(arr: T[], oldIndex: number, newIndex: number) => T[];
export declare const findIndex: (arr: [], target: any) => number | undefined;
export declare const isRectsInterSect: (boundsA: Bounds, boundsB: Bounds) => boolean;
export declare const isVector2d: (source: any) => boolean;
