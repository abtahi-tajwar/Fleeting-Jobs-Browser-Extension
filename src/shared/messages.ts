import type { DetectedField } from "./types";

export type ExtensionMessage =
  | {
      type: "DETECT_FIELDS";
    }
  | {
      type: "FILL_FORM";
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
      success: false;
      error: string;
    };