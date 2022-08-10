const mockCall = (url: string, params: Record<string,string>, options: Record<string, string>) => {
  // stringifyQuery(params)
  const [appName, tag, path, method, scene, source] = ['cinspfront', 'master', url, options.method, options.scene || 'default', 'ZAPPINFO'];
  return fetch(`https://oneapitwa.alipay.com/api/mock/proxy?appName=${encodeURIComponent(appName)}&tag=${encodeURIComponent(tag)}&path=${encodeURIComponent(path)}&method=${method}&scene=${encodeURIComponent(scene || 'default')}&source=${source}&${''}`, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    // data: JSON.stringify(params),
  }).then((res) => res.json())
};

export default mockCall;