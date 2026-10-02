import type {
  FormLabel,
  LabeledTree,
  LabeledTreeNode,
  FormTreeSnapshot
} from "../../shared/formTree";



export class TreeSerializer {
  serialize(
    tree: LabeledTree,
  ): FormTreeSnapshot {
    return this.serializeNode(
      tree.root,
    );
  }

  private serializeNode(
    node: LabeledTreeNode,
  ): FormTreeSnapshot {
    return {
      type: node.type,

      selector: node.selector,

      children:
        node.children.map((child) =>
          this.serializeNode(child),
        ),

      metadata: {
        tagName:
          node.metadata.tagName,

        id:
          node.metadata.id,

        name:
          node.metadata.name,

        className:
          node.metadata.className,

        placeholder:
          node.metadata.placeholder,

        ariaLabel:
          node.metadata.ariaLabel,

        ariaLabelledBy:
          node.metadata
            .ariaLabelledBy,

        inputType:
          node.metadata.inputType,

        value:
          node.metadata.value,

        label:
          node.metadata.label
            ? {
                text:
                  node.metadata
                    .label.text,

                source:
                  node.metadata
                    .label.source,

                selector:
                  node.metadata
                    .label.selector,
              }
            : null,
      },
    };
  }
}