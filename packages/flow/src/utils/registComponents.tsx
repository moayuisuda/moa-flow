import Edge from "../cells/Edge";
import Model from "../Model";

const registComponents = (model: Model) => {
  // CommonNode.regist("CommonNode", model);
  Edge.regist("Edge", model);
};

export { registComponents };
