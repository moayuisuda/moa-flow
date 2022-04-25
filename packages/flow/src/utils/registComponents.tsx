import Model from "../Model";
import CommonNode from "../cells/CommonNode";
import Edge from "../cells/Edge";

const registComponents = (model: Model) => {
  CommonNode.regist("CommonNode", model);
  Edge.regist("Edge", model);
};

export { registComponents };
