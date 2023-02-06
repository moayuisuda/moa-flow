import { isUndefined } from "lodash";
class Constants<
  T extends {
    [key: string | number]: any;
  }
> {
  private readonly source: T[];
  constructor(source: readonly T[]) {
    (this as any).source = source;
  }

  map<KN extends keyof T, VN extends keyof T>(
    keyName: KN,
    valueName: VN
  ): Record<T[KN], T[VN]>;
  map<KN extends keyof T>(keyName: KN): Record<T[KN], T>;
  map<KN extends keyof T, VN extends keyof T>(keyName: KN, valueName?: VN) {
    const { source } = this;

    if (isUndefined(valueName)) {
      const map = {} as Record<T[KN], T>;
      source.forEach((item) => {
        map[item[keyName]] = item;
      });
      return map;
    } else {
      const map = {} as Record<T[KN], T[VN]>;
      source.forEach((item) => {
        map[item[keyName]] = item[valueName];
      });
      return map;
    }
  }

  list<N extends keyof T>(name: N) {
    return this.source.map((item) => item[name]);
  }
}

// 例子
const AUTH_CONSTANT_SOURCE = [
  {
    auth: "admin",
    color: "blue",
    name: "管理员",
    age: 10,
    attrs: { hello: "hello" },
  },
  {
    auth: "normal",
    color: "white",
    name: "普通",
    age: 14,
    attrs: {
      hello: "no",
    },
  },
] as const;

export const authConstants = new Constants(AUTH_CONSTANT_SOURCE);

const AUTH_NAME_MAP = authConstants.map("auth", "color");
AUTH_NAME_MAP.normal;

const AGE_LIST = authConstants.list("age");
const COLOR_LIST = authConstants.list("color");

// =====
const people = [
  {
    id: 1,
    name: "a",
  },
  {
    id: 2,
    name: "b",
  },
] as const;

function test(a: number): number;
function test(a: number, b: string): string;
function test(a: number, b?: string) {
  if (typeof b !== "undefined") {
    return b;
  } else {
    return a;
  }
}

let a = test(1, "asd");
