export type PrunedTreeNodeType =
  | "form"
  | "group"
  | "field";

export interface PrunedTree {
  root: PrunedTreeNode;
}

export interface PrunedTreeNode {
  type: PrunedTreeNodeType;

  /**
   * Actual DOM element represented by this node.
   *
   * This exists only inside the content script.
   */
  element: HTMLElement;

  /**
   * CSS selector that can locate the element again.
   */
  selector: string;

  /**
   * Child nodes in DOM order.
   */
  children: PrunedTreeNode[];

  /**
   * Information extracted directly from the DOM.
   *
   * No semantic interpretation happens here.
   */
  metadata: PrunedTreeMetadata;
}

export interface PrunedTreeMetadata {
  tagName: string;

  id: string | null;

  name: string | null;

  className: string | null;

  placeholder: string | null;

  ariaLabel: string | null;

  ariaLabelledBy: string | null;

  inputType: string | null;

  value: string | boolean | null;
}

export interface LabeledTree {
  root: LabeledTreeNode;
}

export interface LabeledTreeNode {
  type: PrunedTreeNodeType;

  element: HTMLElement;

  selector: string;

  children: LabeledTreeNode[];

  metadata: LabeledTreeMetadata;
}

export interface LabeledTreeMetadata
  extends PrunedTreeMetadata {
  label: FormLabel | null;
}

export interface FormLabel {
  text: string;

  source: FormLabelSource;

  element: HTMLElement | null;

  selector: string | null;
}

export type FormLabelSource =
  | "label"
  | "aria-label"
  | "aria-labelledby"
  | "placeholder"
  | "name"
  | "id"
  | "nearby-text";

export interface FormTreeSnapshot {
  type: PrunedTreeNodeType;
  selector: string;
  children: FormTreeSnapshot[];
  metadata: FormNodeMetadataSnapshot;
}

export interface FormNodeMetadataSnapshot {
  tagName: string;
  id: string | null;
  name: string | null;
  className: string | null;
  placeholder: string | null;
  ariaLabel: string | null;
  ariaLabelledBy: string | null;
  inputType: string | null;
  value: string | boolean | null;
  label: FormLabelSnapshot | null;
}

export interface FormLabelSnapshot {
  text: string;
  source: FormLabelSource;
  selector: string | null;
}