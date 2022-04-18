import { useModel } from '@alipay/bigfish';
import React from '@alipay/bigfish/react';
import { PageContainer } from '@alipay/tech-ui';
import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import styles from './style.less';
import { Flow, RightClickPanel } from 'flow';

export default () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <Flow
        width={800}
        height={800}
        onLoad={(flowModel) => {
          // flowModel.regist(BizNode);
          flowModel.setCanvasData({
            scale: { x: 1, y: 1 },
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
          });
        }}
      >
        {/* <RightClickPanel>
                    {(context: ModelType) => (
                      <Button
                        onClick={() => {
                          console.log(context);
                        }}
                      >
                        点击
                      </Button>
                    )}
                  </RightClickPanel> */}
      </Flow>
      <div className={styles.container}>
        <Guide name={trim(name)} />
      </div>
    </PageContainer>
  );
};
