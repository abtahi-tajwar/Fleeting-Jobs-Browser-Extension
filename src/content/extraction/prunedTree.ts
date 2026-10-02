import type {
  PrunedTree,
  PrunedTreeNode,
  PrunedTreeMetadata,
} from "../../shared/formTree";

const fieldSelector =
  "input, textarea, select";

export class PrunedTreeExtractor {
  extract(
    form: HTMLFormElement,
  ): PrunedTree {
    const root: PrunedTreeNode = {
      type: "form",

      element: form,

      selector:
        this.createSelector(form),

      metadata:
        this.extractMetadata(form),

      children:
        this.extractChildren(form),
    };

    return {
      root,
    };
  }

  private extractChildren(
    parent: HTMLElement,
  ): PrunedTreeNode[] {
    const nodes: PrunedTreeNode[] = [];

    for (const child of Array.from(
      parent.children,
    )) {
      const node =
        this.extractElement(child);

      if (node) {
        nodes.push(node);
      }
    }

    return nodes;
  }

  private extractElement(
    element: Element,
  ): PrunedTreeNode | null {
    /*
     * Form controls become field nodes.
     */
    if (this.isField(element)) {
      return this.createFieldNode(
        element,
      );
    }

    if (
      !(element instanceof HTMLElement)
    ) {
      return null;
    }

    /*
     * Any DOM element containing a form
     * control becomes a structural group.
     *
     * At this stage we do NOT decide what
     * kind of group it is.
     */
    if (
      element.querySelector(
        fieldSelector,
      )
    ) {
      return {
        type: "group",

        element,

        selector:
          this.createSelector(element),

        metadata:
          this.extractMetadata(element),

        children:
          this.extractChildren(element),
      };
    }

    /*
     * Elements that don't contain form
     * controls are discarded.
     */
    return null;
  }

  private createFieldNode(
    element:
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement,
  ): PrunedTreeNode {
    return {
      type: "field",

      element,

      selector:
        this.createSelector(element),

      metadata:
        this.extractMetadata(element),

      children: [],
    };
  }

  private isField(
    element: Element,
  ): element is
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement {
    return (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement
    );
  }

  private extractMetadata(
    element: HTMLElement,
  ): PrunedTreeMetadata {
    const field =
      this.isField(element)
        ? element
        : null;

    return {
      tagName:
        element.tagName.toLowerCase(),

      id:
        element.id || null,

      name:
        field?.getAttribute("name") ??
        null,

      className:
        typeof element.className ===
        "string"
          ? element.className
          : null,

      placeholder:
        field?.getAttribute(
          "placeholder",
        ) ?? null,

      ariaLabel:
        element.getAttribute(
          "aria-label",
        ),

      ariaLabelledBy:
        element.getAttribute(
          "aria-labelledby",
        ),

      inputType:
        element instanceof HTMLInputElement
          ? element.type
          : null,

      value:
        this.getElementValue(element),
    };
  }

  private getElementValue(
    element: HTMLElement,
  ): string | boolean | null {
    if (
      element instanceof HTMLInputElement
    ) {
      if (
        element.type === "checkbox" ||
        element.type === "radio"
      ) {
        return element.checked;
      }

      return element.value;
    }

    if (
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement
    ) {
      return element.value;
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

      if (
        current instanceof HTMLElement &&
        current.classList.length > 0
      ) {
        const classes =
          Array.from(current.classList)
            .slice(0, 2)
            .map((className) =>
              CSS.escape(className),
            )
            .join(".");

        if (classes) {
          selector += `.${classes}`;
        }
      }

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
          const index =
            siblings.indexOf(current) + 1;

          selector +=
            `:nth-of-type(${index})`;
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