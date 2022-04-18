// 运行时配置
import { RequestConfig, RunTimeLayoutConfig } from '@alipay/bigfish';
import services from '@/services/afs2demo';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://bigfish.antfin-inc.com/doc/console-initial-state
export async function getInitialState(): Promise<API.UserInfo> {
  const { data } = await services.UserController.getUserDetail({
    userId: '1',
  });
  return data;
}

// request 配置参考文档：https://bigfish.antfin-inc.com/doc/console-request
export const request: RequestConfig = {};

/**
 * layout 的 runtime 配置
 * @description 这里支持导入文件和 ProLayout 的几乎所有配置
 * @see https://hitu.alipay.com/designs/tech-ui/components/ProLayout/react?renderType=react
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    // title: initialState?.name,
  };
};
