import MatrixNode from "../cells/Matrix/MatrixNode";
import Inspector from "../cells/Inspector";
import Edge from "../cells/Edge";
import TuringNode from "../cells/Turing/TuringNode";

const registComponents = (model) => {
  MatrixNode.registComponent(model);
  Inspector.registComponent(model);
  TuringNode.registComponent(model);
  Edge.registComponent(model);
};

export { registComponents };
