// 向量相加 或者 向量与坐标相加
export const add = function (vectorA, vectorB) {
    return [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]]
}

// 向量乘以常量系数
export const multiply = function (vector, k) {
    return [vector[0] * k, vector[1] * k]
}

// 两点之间的向量，a点指向b点
export const vectorFromPoints = function (pointA, pointB) {
    return [pointB[0] - pointA[0], pointB[1] - pointA[1]]
}

// 判断向量是否平行
export const isParallel = function (vectorA, vectorB) {
    if (vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0] === 0) return true;

    return false;
}

//向量点积
export const dot = function (vectorA, vectorB) {
    return vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
}
// 向量叉乘
export const cross = function (vectorA, vectorB) {
    return vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0];
}

// 向量夹角
export const angleFrom = function (vector) {
    return Math.acos(vector[0] / Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]))
}

// 获取向量的单位向量
export const getUnitVector = function (vector) {
    var m = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
    return [vector[0] / m, vector[1] / m]
}

// 判断向量 x,y 坐标相等
export const equals = function (vector, target) {
    return vector[0] === target[0] && vector[1] === target[1]
}

//中线智能 避让

// let turnRatio = 0.5

//描述方向 使用svg 平面轴 上：[0,-1] 右：[1,0] 下 [1,1] 左 [-1,0]
// path 指除了延申线之外的连接线
function generateConnectionPoints({ entryPoint = [0, 0], entryDirection = [0, 1], entryExt = 10, exitPoint = [10, 10], exitDirection = [1, 0], exitExt = 10 }, turnRatio = 0.5) {
    // 1. 获得入方向和出方向 ——参数中已获得; 当exitDirection 未定义时
    if (exitDirection === null || exitDirection.join() == '0,0') {
        let entryToExit = vectorFromPoints(exitPoint, entryPoint)
        if (Math.abs(entryToExit[0]) > Math.abs(entryToExit[1])) {
            exitDirection = [entryToExit[0] / Math.abs(entryToExit[0]), 0]
        } else {
            exitDirection = [0, entryToExit[1] / Math.abs(entryToExit[1])]
        }
    }

    // 2. 获得直接 path 的水平和竖直方向
    let pathStartP = add(entryPoint, multiply(entryDirection, entryExt));
    let pathEndP = add(exitPoint, multiply(exitDirection, exitExt));

    // 出口方向需要取反 
    exitDirection = multiply(exitDirection, -1);

    //直接path的向量
    // let pathVec = vectorFromPoints(pathEndP,pathStartP);
    // path的水平向量
    let pathHorizenVec = [pathEndP[0] - pathStartP[0], 0];
    // path 的竖直向量
    let pathVerticalVec = [0, pathEndP[1] - pathStartP[1]];


    //3.计算path 的起始方向： 两方向与入方向平行的一项，如果是同向则取之，反之则取非平行的一项
    let comp = [pathHorizenVec, pathVerticalVec]
    let pathStart;
    let startParallelVec = comp.find(vec => isParallel(vec, entryDirection));

    if (dot(startParallelVec, entryDirection) > 0) {
        pathStart = startParallelVec
    } else {
        pathStart = anotherOne(comp, startParallelVec);
    }

    // 4.计算path 的末方向： 两方向与末方向平行的一项，如果是同向则取之，反之则取非平行的一项
    let pathEnd;
    let endParallelVec = comp.find(vec => isParallel(vec, exitDirection));

    if (dot(endParallelVec, exitDirection) > 0) {
        pathEnd = endParallelVec
    } else {
        pathEnd = anotherOne(comp, endParallelVec);

    }

    //5.如果path的起末为同方向，则分为两段，否则为1段
    let splitNum = dot(pathStart, pathEnd) > 0 ? 2 : 1;

    let pathMiddle = anotherOne(comp, pathEnd);

    //6.计算path中的转折点 返回数据中加入了单位向量
    let points = [];
    points.push({
        position: entryPoint,
        direction: null
    }, {
        position: pathStartP,
        direction: entryDirection
    });
    if (splitNum == 1) {
        let point1 = add(pathStartP, pathStart)
        let dir1 = getUnictVecByStraight(pathStart)
        let point2 = add(point1, pathEnd)
        let dir2 = getUnictVecByStraight(pathEnd)
        points.push({
            position: point1,
            direction: dir1
        }, {
            position: point2,
            direction: dir2
        })
    } else {

        let point1 = add(pathStartP, multiply(pathStart, turnRatio));

        let dir1 = getUnictVecByStraight(pathStart);

        let point2 = add(point1, pathMiddle);
        let dir2 = getUnictVecByStraight(pathMiddle);
        let point3 = add(point2, multiply(pathEnd, 1 - turnRatio));
        let dir3 = getUnictVecByStraight(pathEnd)


        points.push({
            position: point1,
            direction: dir1
        }, {
            position: point2,
            direction: dir2,
            type: "pathMiddleP"
        }, {
            position: point3,
            direction: dir3
        })
    }
    points.push({
        position: exitPoint,
        direction: exitDirection
    });

    return points.filter(v => v.direction !== false);

}

// 两个元素的数组中的另一个
function anotherOne(comp, a) {
    return comp.find(v => v != a)
}

// 获取竖直和水平向量的单位向量
function getUnictVecByStraight(vector) {
    if (vector[0] == 0 && vector[1] == 0)
        return false
    else if (vector[0] == 0)
        return [0, vector[1] / Math.abs(vector[1])]
    else if (vector[1] == 0)
        return [vector[0] / Math.abs(vector[0]), 0]
    else
        return getUnitVector(vector)
}

export default generateConnectionPoints;

export const lineCenter = (points: [number, number][], intercept: number = 0.5) => {
    let total = 0,
        lens = [];
    for (let i = 1; i < points.length; i++) {
        let len = Math.sqrt(Math.pow(points[i][0] - points[i - 1][0], 2) + Math.pow(points[i][1] - points[i - 1][1], 2));
        lens.push(len);
        total += len;
    }
    let half = intercept <= 1 ? total * intercept : intercept;
    for (let i = 1; i < points.length; i++) {
        if (half > lens[i - 1]) {
            half -= lens[i - 1]
        } else {
            let t = half / lens[i - 1],
                x = points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t,
                y = points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t;
            return [x, y];
        }
    }
}
