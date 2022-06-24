import * as React from 'react';
import type { CascaderProps as RcCascaderProps } from 'rc-cascader';
import type { FieldNames } from 'rc-cascader/lib/interface';
import type { SizeType } from '../config-provider/SizeContext';
export declare type FieldNamesType = FieldNames;
export declare type FilledFieldNamesType = Required<FieldNamesType>;
export interface CascaderProps extends Omit<RcCascaderProps, 'checkable'> {
    multiple?: boolean;
    size?: SizeType;
    bordered?: boolean;
}
interface CascaderRef {
    focus: () => void;
    blur: () => void;
}
declare const Cascader: React.ForwardRefExoticComponent<CascaderProps & React.RefAttributes<CascaderRef>>;
export default Cascader;
