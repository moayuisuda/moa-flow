export const getEl = (className: string): HTMLElement => {
  const selector = `.${className}`;
  const el = document.querySelector(selector);

  if (!el) throw new Error(`[flow] no element match selector ${selector}`);

  return el as HTMLElement;
};

// 向量相加 或者 向量与坐标相加
export const add = function (vectorA: any[], vectorB: any[]) {
  return [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]];
};

// 向量乘以常量系数
export const multiply = function (vector: number[], k: number) {
  return [vector[0] * k, vector[1] * k];
};

// 两点之间的向量，a点指向b点
export const vectorFromPoints = function (pointA: number[], pointB: number[]) {
  return [pointB[0] - pointA[0], pointB[1] - pointA[1]];
};

// 判断向量是否平行
export const isParallel = function (vectorA: number[], vectorB: number[]) {
  if (vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0] === 0) return true;

  return false;
};

//向量点积
export const dot = function (vectorA: number[], vectorB: number[]) {
  return vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
};
// 向量叉乘
export const cross = function (vectorA: number[], vectorB: number[]) {
  return vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0];
};

// 向量夹角
export const angleFrom = function (vector: number[]) {
  return Math.acos(
    vector[0] / Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
  );
};

// 获取向量的单位向量
export const getUnitVector = function (vector: number[]) {
  const m = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
  return [vector[0] / m, vector[1] / m];
};

// 判断向量 x,y 坐标相等
export const equals = function (vector: any[], target: any[]) {
  return vector[0] === target[0] && vector[1] === target[1];
};

//中线智能 避让

// let turnRatio = 0.5

// 两个元素的数组中的另一个
function anotherOne(comp: any[], a: number[] | undefined) {
  return comp.find((v: any) => v !== a);
}

// 获取竖直和水平向量的单位向量
function getUnictVecByStraight(vector: number[]) {
  if (vector[0] === 0 && vector[1] === 0) return false;
  else if (vector[0] === 0) return [0, vector[1] / Math.abs(vector[1])];
  else if (vector[1] === 0) return [vector[0] / Math.abs(vector[0]), 0];
  else return getUnitVector(vector);
}

//描述方向 使用svg 平面轴 上：[0,-1] 右：[1,0] 下 [0,1] 左 [-1,0]
// path 指除了延申线之外的连接线
export function generateConnectionPoints(
  {
    sourcePoint = [0, 0],
    sourceDir = [0, 1],
    sourceExt = 10,
    targetPoint = [10, 10],
    targetDir = [1, 0],
    targetExt = 10,
  },
  turnRatio = 0.5
) {
  // 1. 获得入方向和出方向 ——参数中已获得; 当targetDir 未定义时
  if (targetDir === null || targetDir.join() === "0,0") {
    const entryToExit = vectorFromPoints(targetPoint, sourcePoint);
    if (Math.abs(entryToExit[0]) > Math.abs(entryToExit[1])) {
      targetDir = [entryToExit[0] / Math.abs(entryToExit[0]), 0];
    } else {
      targetDir = [0, entryToExit[1] / Math.abs(entryToExit[1])];
    }
  }

  // 2. 获得直接 path 的水平和竖直方向
  const pathStartP = add(sourcePoint, multiply(sourceDir, sourceExt));
  const pathEndP = add(targetPoint, multiply(targetDir, targetExt));

  // 出口方向需要取反
  targetDir = multiply(targetDir, -1);

  //直接path的向量
  // let pathVec = vectorFromPoints(pathEndP,pathStartP);
  // path的水平向量
  const pathHorizenVec = [pathEndP[0] - pathStartP[0], 0];
  // path 的竖直向量
  const pathVerticalVec = [0, pathEndP[1] - pathStartP[1]];

  //3.计算path 的起始方向： 两方向与入方向平行的一项，如果是同向则取之，反之则取非平行的一项
  const comp = [pathHorizenVec, pathVerticalVec];
  let pathStart;
  const startParallelVec = comp.find((vec) =>
    isParallel(vec, sourceDir)
  ) as number[];

  if (dot(startParallelVec, sourceDir) > 0) {
    pathStart = startParallelVec;
  } else {
    pathStart = anotherOne(comp, startParallelVec);
  }

  // 4.计算path 的末方向： 两方向与末方向平行的一项，如果是同向则取之，反之则取非平行的一项
  let pathEnd;
  const endParallelVec = comp.find((vec) =>
    isParallel(vec, targetDir)
  ) as number[];

  if (dot(endParallelVec, targetDir) > 0) {
    pathEnd = endParallelVec;
  } else {
    pathEnd = anotherOne(comp, endParallelVec);
  }

  //5.如果path的起末为同方向，则分为两段，否则为1段
  const splitNum = dot(pathStart, pathEnd) > 0 ? 2 : 1;

  const pathMiddle = anotherOne(comp, pathEnd);

  //6.计算path中的转折点 返回数据中加入了单位向量
  const points = [];
  points.push(
    {
      position: sourcePoint,
      direction: null,
    },
    {
      position: pathStartP,
      direction: sourceDir,
    }
  );
  if (splitNum === 1) {
    const point1 = add(pathStartP, pathStart);
    const dir1 = getUnictVecByStraight(pathStart);
    const point2 = add(point1, pathEnd);
    const dir2 = getUnictVecByStraight(pathEnd);
    points.push(
      {
        position: point1,
        direction: dir1,
      },
      {
        position: point2,
        direction: dir2,
      }
    );
  } else {
    const point1 = add(pathStartP, multiply(pathStart, turnRatio));

    const dir1 = getUnictVecByStraight(pathStart);

    const point2 = add(point1, pathMiddle);
    const dir2 = getUnictVecByStraight(pathMiddle);
    const point3 = add(point2, multiply(pathEnd, 1 - turnRatio));
    const dir3 = getUnictVecByStraight(pathEnd);

    points.push(
      {
        position: point1,
        direction: dir1,
      },
      {
        position: point2,
        direction: dir2,
        type: "pathMiddleP",
      },
      {
        position: point3,
        direction: dir3,
      }
    );
  }
  points.push({
    position: targetPoint,
    direction: targetDir,
  });

  return points.filter((v) => v.direction !== false);
}
