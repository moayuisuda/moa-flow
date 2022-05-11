import { useModel } from '@alipay/bigfish';
import React from '@alipay/bigfish/react';
import { PageContainer } from '@alipay/tech-ui';
import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import styles from './style.less';
import { Flow, RightClickPanel } from '@ali/flow-infra-g';
import { Button } from 'antd';

export default () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <Button>HELLO</Button>
      <Flow
        width={800}
        height={800}
        canvasData={{
          scale: 1,
          x: 0,
          y: 0,
          cells: [
            {
              id: 'TEST_NODE',
              component: 'CommonNode',
              cellType: 'node',
              x: 100,
              y: 100,
            },
          ],
        }}
      />
      <div className={styles.container}>
        <Guide name={trim(name)} />
      </div>
    </PageContainer>
  );
};
