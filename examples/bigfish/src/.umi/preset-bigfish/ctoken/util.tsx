// @ts-nocheck
function getBaseDomain(host: string) {
  // 要是 ip
  if (!/[a-z]/i.test(host)) {
    return host;
  }
  // 返回主域
  return host
    .split('.')
    .slice(-2)
    .join('.');
}

const a =
  typeof document !== 'undefined' ? document.createElement('a') : undefined;

function getHostName(url: string) {
  if (a) {
    a.href = url;
    return a.hostname;
  }
}

function withCtoken(
  url: string,
  hostname: string,
  getTargetHostName = getHostName,
) {
  let bool = false;

  // 要是访问 http url
  if (/^(https?:)?\/\//.test(url)) {
    const targetHostname = getTargetHostName(url);

    // 要是 hostname 相同会带上 ctoken
    if (targetHostname === hostname) {
      bool = true;

      // 要是主域相同也可带上 ctoken
    } else if (getBaseDomain(targetHostname) === getBaseDomain(hostname)) {
      bool = true;
    }

    // 要是访问的不是 http url（比如 /api) 带上 ctoken
  } else {
    bool = true;
  }
  return bool;
}

export { getBaseDomain, withCtoken };
