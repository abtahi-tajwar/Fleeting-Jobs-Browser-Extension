import type {
  DetectedField,
} from "./types";

import type {
  FormTreeSnapshot,
} from "../shared/formTree";

export type ExtensionMessage =
  | {
      type: "DETECT_FIELDS";
    }
  | {
      type: "FILL_FORM";
    }
  | {
      type: "EXTRACT_FORM_TREE";
    };

export type ExtensionResponse =
  | {
      success: true;
      fields: DetectedField[];
    }
  | {
      success: true;
      filled: number;
    }
  | {
      success: true;
      tree: FormTreeSnapshot | null;
    }
  | {
      success: false;
      error: string;
    };