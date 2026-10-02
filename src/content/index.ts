import { detectFields } from "./fieldDetectors";
import { fillForm } from "./formFiller";
import { loadProfile } from "../shared/profile";

import { ExtractionPipeline } from "./extraction/extractionPipeline";

import { TreeSerializer } from "./extraction/treeSerializer";

import type { ExtensionMessage, ExtensionResponse } from "../shared/messages";

console.log("🚀 Fleeting Jobs content script loaded");

const extractionPipeline = new ExtractionPipeline();

const treeSerializer = new TreeSerializer();

let extractedTree = null;

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: ExtensionResponse) => void,
  ): boolean => {
    try {
      if (message.type === "EXTRACT_FORM_TREE") {
        const form = document.querySelector("form");

        if (!(form instanceof HTMLFormElement)) {
          sendResponse({
            success: true,
            tree: null,
          });

          return true;
        }

        extractedTree = extractionPipeline.run(form);

        console.log("🌳 Extraction tree:", extractedTree);

        sendResponse({
          success: true,

          tree: treeSerializer.serialize(extractedTree),
        });

        return true;
      }

      if (message.type === "DETECT_FIELDS") {
        console.log("Detecting form fields");

        const fields = detectFields();

        sendResponse({
          success: true,
          fields,
        });

        return true;
      }

      if (message.type === "FILL_FORM") {
        const profile = loadProfile();

        const results = fillForm(profile);

        const filled = results.filter((result) => result.filled).length;

        sendResponse({
          success: true,
          filled,
        });

        return true;
      }

      sendResponse({
        success: false,
        error: "Unknown message type",
      });
    } catch (error) {
      console.error("❌ Content script error:", error);

      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return true;
  },
);
