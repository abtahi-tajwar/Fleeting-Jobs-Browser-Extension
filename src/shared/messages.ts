import type { DetectedField } from "./types";

export type ExtensionMessage = {
  type: "DETECT_FIELDS";
};

export type ExtensionResponse =
  | {
      success: true;
      fields: DetectedField[];
    }
  | {
      success: false;
      error: string;
    };
