import MatrixNode from "@/cells/Matrix/MatrixNode";
import Edge from "@/cells/Edge";

const registComponents = (model) => {
  // 自定义的组件也需要在这里注册
  MatrixNode.registComponent(model);
  Edge.registComponent(model);
};

export { registComponents };
