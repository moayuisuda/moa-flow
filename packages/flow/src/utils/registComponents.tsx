import CommonNode from "@/cells/CommonNode";
import Edge from "@/cells/Edge";

const registComponents = (model) => {
  CommonNode.regist(model);
  Edge.regist(model);
};

export { registComponents };
