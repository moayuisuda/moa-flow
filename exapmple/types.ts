class ConstantsFactory<
  T extends {
    [key: string | number]: any;
  }
> {
  readonly source: T[];
  constructor(source: readonly T[]) {
    (this as any).source = source;
  }

  map<KN extends keyof T, VN extends keyof T>(keyName: KN, valueName?: VN) {
    const { source } = this;
    const map = {} as any;
    source.forEach((item) => {
      map[item[keyName]] = valueName ? item[valueName] : item;
    });

    type Keys = T[typeof keyName];
    type Map = Record<Keys, T>;
    return map as Map;
  }

  list<N extends keyof T>(name: N) {
    return this.source.map((item) => item[name]);
  }
}

// 例子
const TNT_ID_MAP = {
  FCIA: "fcia",
  ALIPAY: "alipay",
};
const TNT_NAME_MAP = {
  FCIA: "网商银行",
  ALIPAY: "支付宝",
};

const TNT_SOURCE = [
  { id: "fcia", name: "网商银行", productCode: 11232, auth: ["name"] },
  { id: "alipay", name: "支付宝", productCode: 12323, auth: ["age"] },
] as const;

export const tntConstants = new ConstantsFactory(TNT_SOURCE);

const idMap = tntConstants.map("id");
const codeToNameMap = tntConstants.map("productCode", "name");
const list = tntConstants.list('auth');

console.log(idMap, codeToNameMap, list);

// =====
// const people = [
//   {
//     id: 1,
//     name: "a",
//   },
//   {
//     id: 2,
//     name: "b",
//   },
// ] as const;

// function toList<T, N extends keyof T>(arr: readonly T[], name: N) {
//   return arr.map((item) => item[name]);
// }
// const list = toList(people, "name");

// const map = toMap(people);
// (id) => name;
