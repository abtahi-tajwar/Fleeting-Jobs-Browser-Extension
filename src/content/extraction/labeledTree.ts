import type {
  FormLabel,
  LabeledTree,
  LabeledTreeNode,
  PrunedTree,
  PrunedTreeNode,
} from "../../shared/formTree";

export class LabeledTreeExtractor {
  extract(
    tree: PrunedTree,
  ): LabeledTree {
    return {
      root: this.processNode(
        tree.root,
      ),
    };
  }

  private processNode(
    node: PrunedTreeNode,
  ): LabeledTreeNode {
    return {
      type: node.type,

      element: node.element,

      selector: node.selector,

      children:
        node.children.map((child) =>
          this.processNode(child),
        ),

      metadata: {
        ...node.metadata,

        label:
          node.type === "field"
            ? this.extractLabel(
                node.element,
              )
            : null,
      },
    };
  }

  private extractLabel(
    element: HTMLElement,
  ): FormLabel | null {
    /*
     * 1. Explicit <label for="...">
     */
    if (element.id) {
      const label =
        document.querySelector(
          `label[for="${CSS.escape(
            element.id,
          )}"]`,
        );

      if (
        label instanceof HTMLElement
      ) {
        const text =
          label.textContent?.trim();

        if (text) {
          return {
            text,

            source: "label",

            element: label,

            selector:
              this.createSelector(
                label,
              ),
          };
        }
      }
    }

    /*
     * 2. Field nested inside <label>
     */
    const parentLabel =
      element.closest("label");

    if (
      parentLabel instanceof HTMLElement
    ) {
      const text =
        parentLabel.textContent?.trim();

      if (text) {
        return {
          text,

          source: "label",

          element: parentLabel,

          selector:
            this.createSelector(
              parentLabel,
            ),
        };
      }
    }

    /*
     * 3. aria-label
     */
    const ariaLabel =
      element.getAttribute(
        "aria-label",
      );

    if (ariaLabel?.trim()) {
      return {
        text: ariaLabel.trim(),

        source: "aria-label",

        element: null,

        selector: null,
      };
    }

    /*
     * 4. aria-labelledby
     */
    const ariaLabelledBy =
      element.getAttribute(
        "aria-labelledby",
      );

    if (ariaLabelledBy) {
      const text =
        ariaLabelledBy
          .split(/\s+/)
          .map((id) => {
            const labelledElement =
              document.getElementById(id);

            return (
              labelledElement?.textContent?.trim() ??
              ""
            );
          })
          .filter(Boolean)
          .join(" ");

      if (text) {
        return {
          text,

          source:
            "aria-labelledby",

          element: null,

          selector: null,
        };
      }
    }

    /*
     * 5. Placeholder
     */
    const placeholder =
      element.getAttribute(
        "placeholder",
      );

    if (placeholder?.trim()) {
      return {
        text: placeholder.trim(),

        source: "placeholder",

        element: null,

        selector: null,
      };
    }

    /*
     * 6. name
     */
    const name =
      element.getAttribute("name");

    if (name?.trim()) {
      return {
        text: name.trim(),

        source: "name",

        element: null,

        selector: null,
      };
    }

    /*
     * 7. id
     */
    if (element.id) {
      return {
        text: element.id,

        source: "id",

        element: null,

        selector: null,
      };
    }

    return null;
  }

  private createSelector(
    element: Element,
  ): string {
    if (
      element instanceof HTMLElement &&
      element.id
    ) {
      return `#${CSS.escape(element.id)}`;
    }

    const parts: string[] = [];

    let current: Element | null =
      element;

    while (
      current &&
      current !== document.documentElement
    ) {
      let selector =
        current.tagName.toLowerCase();

      const parent =
        current.parentElement;

      if (parent) {
        const siblings =
          Array.from(
            parent.children,
          ).filter(
            (child) =>
              child.tagName ===
              current!.tagName,
          );

        if (siblings.length > 1) {
          selector +=
            `:nth-of-type(${
              siblings.indexOf(
                current,
              ) + 1
            })`;
        }
      }

      parts.unshift(selector);

      current =
        current.parentElement;

      if (
        current instanceof HTMLFormElement
      ) {
        parts.unshift("form");
        break;
      }
    }

    return parts.join(" > ");
  }
}