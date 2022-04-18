// 全局共享数据示例
// 更多参考文档 https://bigfish.antfin-inc.com/doc/vg6qys
import { useState } from '@alipay/bigfish/react';
import { DEFAULT_NAME } from '@/constants';

const useUser = () => {
  const [name, setName] = useState<string>(DEFAULT_NAME);
  return {
    name,
    setName,
  };
};

export default useUser;
