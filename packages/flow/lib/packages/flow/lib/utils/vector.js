// 向量相加 或者 向量与坐标相加
const lineCenter = (points, intercept = 0.5) => {
    let total = 0, lens = [];
    for (let i = 1; i < points.length; i++) {
        let len = Math.sqrt(Math.pow(points[i][0] - points[i - 1][0], 2) + Math.pow(points[i][1] - points[i - 1][1], 2));
        lens.push(len);
        total += len;
    }
    let half = intercept <= 1 ? total * intercept : intercept;
    for (let i = 1; i < points.length; i++) {
        if (half > lens[i - 1]) {
            half -= lens[i - 1];
        }
        else {
            let t = half / lens[i - 1], x = points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t, y = points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t;
            return [x, y];
        }
    }
};

export { lineCenter };
