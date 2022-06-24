// @ts-nocheck
import Cookie from '@alipay/bigfish/util/js-cookie';
import { getBaseDomain } from './util';

export function getToken() {
  if (/[a-z]/i.test(location.hostname)) {
    // ip 不用先删除
  } else {
    // 先删除当前域名的 ctoken
    Cookie.remove('ctoken');
  }

  // 再尝试获得 ctoken
  let ctoken = Cookie.get('ctoken');
  // 要是有 ctoken 则返回
  if (ctoken) {
    return ctoken;
  }

  // 要是没有，则在主域下加上 ctoken
  ctoken = 'bigfish_ctoken_' + (+new Date()).toString(22);
  const domain = getBaseDomain(location.hostname);
  /*
      domain               cookie
      127.0.0.1:7001       127.0.0.1
      localhost:7001       localhost
      dev.alipay.net:7001  .alipay.net
      alipay.net           .alipay.net
      bigfish.alipay.com   .alipay.com
  */
  Cookie.set('ctoken', ctoken, { domain });
  return ctoken;
}
