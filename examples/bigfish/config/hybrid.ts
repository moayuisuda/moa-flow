/**
 * 此文件是混合研发的配置文件，一般不需要手动配置，由脚手架自动生成。
 * 如果应用不需要使用混合研发能力，可以自行去掉对此文件的引入。
 *
 * 相关资料：
 * 中后台混合研发方案 -- Bigfly：https://bigfish.antfin-inc.com/doc/advanced-yunfengdie
 */

import { IConfigFromPlugins } from '@@/core/pluginConfig';

interface HybridConfig {
  bigfly?: {
    mode: 'local' | 'cloud';
  };
  tern?: IConfigFromPlugins['tern'];
}

const hybrid: HybridConfig = {};

// enableBigfly 和 enableTern 通常使用脚手架生成的默认值即可，请在完全了解后果的情况下做变更，不当的配置可能会导致应用部署失败！！
const enableBigfly = false;
const enableTern = false;

if (enableBigfly) {
  // 启用 Bigfly 的云端模式
  hybrid.bigfly = { mode: 'cloud' };
}
if (enableTern) {
  // 启用燕鸥插件，配置文档见 https://yuque.antfin-inc.com/tern/manual/uvt1gh
  hybrid.tern = {
    proxy: {
      mode: 'cors',
      DEV: {
        '/api': {
          target: 'http://oneapidemo.inc.alipay.net',
        },
      },

      TEST: {
        '/api': {
          target: 'http://serverName.test.alipay.net',
          pathRewrite: {
            '^/api': '/api/v1',
          },
        },
      },

      PRE: {
        '/api': {
          target: 'https://serverName-pre.alipay.com',
          pathRewrite: {
            '^/api': '/api/v1',
          },
        },
      },

      PROD: {
        '/api': {
          target: 'https://serverName.alipay.com',
          pathRewrite: {
            '^/api': '/api/v1',
          },
        },
      },
    },
  };
}

export default hybrid;
