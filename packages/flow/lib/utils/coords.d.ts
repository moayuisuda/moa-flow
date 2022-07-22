export interface BoundingBox {
    left: number;
    top: number;
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare const getRelativeBoundingBox: (element: HTMLElement, container: HTMLElement) => BoundingBox;
