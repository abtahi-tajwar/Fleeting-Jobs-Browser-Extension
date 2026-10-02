import type {
  LabeledTree,
} from "../../shared/formTree";

import {
  PrunedTreeExtractor,
} from "./prunedTree";

import {
  LabeledTreeExtractor,
} from "./labeledTree";

export class ExtractionPipeline {
  private readonly prunedTreeExtractor: PrunedTreeExtractor;

  private readonly labeledTreeExtractor: LabeledTreeExtractor;

  constructor() {
    this.prunedTreeExtractor =
      new PrunedTreeExtractor();

    this.labeledTreeExtractor =
      new LabeledTreeExtractor();
  }

  run(
    form: HTMLFormElement,
  ): LabeledTree {
    const prunedTree =
      this.prunedTreeExtractor.extract(
        form,
      );

    const labeledTree =
      this.labeledTreeExtractor.extract(
        prunedTree,
      );

    return labeledTree;
  }
}