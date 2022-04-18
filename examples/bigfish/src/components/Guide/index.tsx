import React from '@alipay/bigfish/react';
import { Row, Button, Typography, Layout } from '@alipay/bigfish/antd';
import { WelcomeCard } from '@alipay/tech-ui';

import styles from './style.less';

interface Props {
  name: string;
}

// 脚手架示例组件
const Guide: React.FC<Props> = (props) => {
  const { name } = props;
  return (
    <Layout>
      <Row>
        <Typography.Title level={3} className={styles.title}>
          欢迎使用 <strong>{name}</strong> ！
        </Typography.Title>
      </Row>
      <Row>
        <WelcomeCard.Operation
          icon="https://gw-office.alipayobjects.com/basement_prod/c83c53ab-515e-43e2-85d0-4d0da16f11ef.svg"
          leftTitle="关于 Bigfish"
          leftContent="Bigfish 是一个企业级前端研发框架，并提供了一套完整的最佳实践。写前端，用 Bigfish 就够了！"
          leftActions={[
            <Button href="https://bigfish.antfin-inc.com/" key="0" type="primary">
              前往 Bigfish 官网
            </Button>,
          ]}
          leftSpan={9}
          rightSpan={15}
          rightTitle="相关帮助"
          rightContent={
            <WelcomeCard.QuickLinks
              links={[
                {
                  text: 'Ant Design - 企业级产品设计体系，创造高效愉悦的工作体验',
                  link: 'https://ant.design',
                },
                {
                  text: 'TechUI - 基于 Ant Design 的蚂蚁集团企业级 UI 资产库',
                  link: 'https://techui.alipay.com',
                },
                {
                  text: 'AntV - 企业级可视分析前端类库',
                  link: 'https://antv.alipay.com',
                },
                {
                  text: 'OneAPI - 前后端联调标准方案',
                  link: 'https://oneapi.alipay.com',
                },
                {
                  text: 'OneX - 蚂蚁产品上云一体化方案',
                  link: 'https://bigfish.antfin-inc.com/doc/onex-getting-started',
                },
                {
                  text: '雨燕 - 你的大前端工作台',
                  link: 'https://yuyan.antfin-inc.com/',
                },
              ]}
            />
          }
        />
      </Row>
    </Layout>
  );
};

export default Guide;
