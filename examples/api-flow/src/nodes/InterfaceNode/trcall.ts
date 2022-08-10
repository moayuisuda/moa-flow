let serviceMap: any = {};

const getServiceList = async () => {
  return await fetch('http://rcservcenter-eu95-0.gz00b.stable.alipay.net/home/meta/service/queryAll.json').then(res => res.json());
}
const init = async () => {
  const serviceList = (await getServiceList()).data;
  serviceList.forEach((service: any) => {
    serviceMap[
      `${service.rcFuncInterfaceClassName
        .split('.')
        .pop()}.${service.rcFuncMethodName}`
    ] = {
      productCode:
        JSON.parse(service.requestParam || '{}')?.productCode ||
        '',
      serviceCode: service.serviceCode.trim(),
    };
  });
}
init();

export default (service: string[], params: object, interfaceSchema: { domain: string }) => {
  const { domain } = interfaceSchema;
  const [facadeName, methodName] = service;
  return (fetch(`${domain}/home/service/gw.json?mn=` + methodName, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...serviceMap[facadeName + '.' + methodName],
      productCode: 'cfinspection',
      data: params,
    }),
  }) as Promise<any>).then(async response => {
    const res = await response.json();
    if (res.success) return res;
    else return Promise.reject(res.errMsg);
  });
};

