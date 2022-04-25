import CommonNode from '../cells/CommonNode/index.js';
import Edge from '../cells/Edge.js';

const registComponents = (model) => {
    CommonNode.regist("CommonNode", model);
    Edge.regist("Edge", model);
};

export { registComponents };
