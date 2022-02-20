import Cell from '../nodes/Cell';

export type PortType = {
    id: string,
    target: string,
    data: any,
    linkable?: boolean;
}

export type FieldType = {
    label: string,
    ports: PortType[]
}