import { useAccess, Access } from '@alipay/bigfish';
import { Button } from '@alipay/bigfish/antd';
import React from '@alipay/bigfish/react';
import { PageContainer } from '@alipay/tech-ui';

export default () => {
  const access = useAccess();
  return (
    <PageContainer
      ghost
      header={{
        title: '权限示例',
      }}
    >
      <Access accessible={access.canSeeAdmin}>
        <Button>只有 Admin 可以看到这个按钮</Button>
      </Access>
    </PageContainer>
  );
};
