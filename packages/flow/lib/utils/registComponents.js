import Edge from '../cells/Edge.js';

var registComponents = function (model) {
    // CommonNode.regist("CommonNode", model);
    Edge.regist("Edge", model);
};

export { registComponents };
