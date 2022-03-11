/// <reference types="react" />
import Edge from "@/cells/Edge";
declare class LinkingEdge extends Edge<{}, {}> {
    getPoints(): any[];
    content(): JSX.Element;
}
export default LinkingEdge;
