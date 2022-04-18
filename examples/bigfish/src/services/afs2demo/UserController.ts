// eslint-disable
import { request } from '@alipay/bigfish';

/** 查询用户列表，并返回分页数据 */
export async function queryUserList(
  params: {
    // query
    /** keyword */
    keyword?: string;
    /** current */
    current?: number;
    /** pageSize */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_PageInfo_UserInfo__>('/api/v1/queryUserList', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 新增用户 */
export async function addUser(body: API.UserInfoVO, options?: { [key: string]: any }) {
  return request<API.Result_UserInfo_>('/api/v1/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户详情 */
export async function getUserDetail(
  params: {
    // path
    /** userId */
    userId: string;
  },
  options?: { [key: string]: any },
) {
  const { userId: param0 } = params;
  return request<API.Result_UserInfo_>(`/api/v1/user/${param0}`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 编辑用户 */
export async function modifyUser(
  params: {
    // path
    /** userId */
    userId: string;
  },
  body: API.UserInfoVO,
  options?: { [key: string]: any },
) {
  const { userId: param0 } = params;
  return request<API.Result_UserInfo_>(`/api/v1/user/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params,
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 */
export async function deleteUser(
  params: {
    // path
    /** userId */
    userId: string;
  },
  options?: { [key: string]: any },
) {
  const { userId: param0 } = params;
  return request<API.Result_string_>(`/api/v1/user/${param0}`, {
    method: 'DELETE',
    params,
    ...(options || {}),
  });
}
