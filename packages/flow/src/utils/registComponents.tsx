import MatrixNode from "@/cells/Matrix/MatrixNode";
import Edge from "@/cells/Edge";

const registComponents = (model) => {
  MatrixNode.regist(model);
  Edge.regist(model);
};

export { registComponents };
