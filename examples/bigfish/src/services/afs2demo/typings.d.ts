declare namespace API {
  interface PageInfo {
    /** 页码
从1开始 */
    current: number;
    /** 页面大小 */
    pageSize: number;
    /** 总数 */
    total: number;
    /** 查询结果列表 */
    list: {}[];
  }

  interface PageInfo_UserInfo_ {
    /** 页码
从1开始 */
    current: number;
    /** 页面大小 */
    pageSize: number;
    /** 总数 */
    total: number;
    /** 查询结果列表 */
    list: UserInfo[];
  }

  interface Result {
    success: boolean;
    /** 响应消息 */
    errorMessage: string;
    /** 响应数据 */
    data: {};
  }

  interface Result_PageInfo_UserInfo__ {
    success: boolean;
    /** 响应消息 */
    errorMessage: string;
    /** 响应数据 */
    data: PageInfo_UserInfo_;
  }

  interface Result_UserInfo_ {
    success: boolean;
    /** 响应消息 */
    errorMessage: string;
    /** 响应数据 */
    data: UserInfo;
  }

  interface Result_string_ {
    success: boolean;
    /** 响应消息 */
    errorMessage: string;
    /** 响应数据 */
    data: string;
  }

  type UserGenderEnum = 'MALE' | 'FEMALE';

  interface UserInfo {
    id: string;
    /** 登录名 */
    name: string;
    /** nick */
    nickName: string;
    /** email */
    email: string;
    gender: UserGenderEnum;
  }

  interface UserInfoVO {
    /** 登录名 */
    name: string;
    /** nick */
    nickName: string;
    /** email */
    email: string;
  }
}
