
// @ts-ignore
export type { IDefineType, IParam, IDefinitions, IMeta, IProtocol, IApi, ISchema, IService } from '@alipay/connect-util';


export type IParamFront = {
    /** 参数ID */
    id: string;
    /** 参数描述 */
    desc: string;
    /** 参数名称 */
    name: string;
    /** 数据类型 */
    type: string;
    /** 赋值方式，变量 / 常量 */
    assignmentType: 'variable' | 'constant';
    /** 值 */
    value: string;
}

export type FlowNodeConfig = {
    interface: any;
    inputParams: IParamFront[];
    title: string;
    type: "TR" | "HTTP";
}