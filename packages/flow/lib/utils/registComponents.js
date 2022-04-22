import CommonNode from '../cells/CommonNode/index.js';
import Edge from '../cells/Edge.js';

const registComponents = (model) => {
    CommonNode.regist(model);
    Edge.regist(model);
};

export { registComponents };
