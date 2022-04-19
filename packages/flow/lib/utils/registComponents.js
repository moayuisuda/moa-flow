import CommonNode from '../cells/CommonNode/index.js';
import Edge from '../cells/Edge.js';

var registComponents = function (model) {
    CommonNode.regist(model);
    Edge.regist(model);
};

export { registComponents };
