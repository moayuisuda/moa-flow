// @ts-nocheck
import { fetch } from 'umi-request';
import { getToken } from './alias';
import { withCtoken } from './util';

fetch.interceptors.request.use((url: string, options: any) => {
  // 对于非 http 请求，如 RPC 请求，无需添加 CToken
  const { __umiRequestCoreType__ = 'normal' } = options;
  if (__umiRequestCoreType__ !== 'normal') {
    return {
      url,
      options,
    };
  }

  if (withCtoken(url, location.hostname)) {
    const ctoken = getToken();
    const str = url.indexOf('?') > -1 ? '&' : '?';
    url = `${url}${str}ctoken=${encodeURIComponent(ctoken)}`;
  }

  return {
    url,
    options,
  };
});
