/// <reference types="react" />
import Edge from "@/cells/Edge";
declare class LinkingEdge extends Edge<{}, {}> {
    protected dash: boolean;
    getPoints(): any[];
    content(): JSX.Element;
}
export default LinkingEdge;
