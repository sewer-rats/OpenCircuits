import {XMLNode} from "./XMLNode";

export class XMLWriter {
    private root: XMLDocument;
    private rootNode: XMLNode;

    public constructor() {
        this.root = new DOMParser().parseFromString("<?xml version=\"1.0\" encoding=\"UTF-8\"?><project></project>", "text/xml");
        this.rootNode = new XMLNode(this.root, this.root.childNodes[0]);
    }

    public getRoot(): XMLNode {
        return this.rootNode;
    }

    public serialize(): string {
        return new XMLSerializer().serializeToString(this.root.documentElement);
    }

}
