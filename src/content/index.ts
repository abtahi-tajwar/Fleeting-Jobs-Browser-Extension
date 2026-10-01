import { detectFields } from "./field-detector";
import { fillForm } from "./form-filler";
import { loadProfile } from "../shared/profile";

import type {
  ExtensionMessage,
  ExtensionResponse
} from "../shared/messages";

console.log(
  "🚀 Fleeting Jobs content script loaded"
);

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (
      response: ExtensionResponse
    ) => void
  ): boolean => {
    try {
      if (
        message.type === "DETECT_FIELDS"
      ) {
        console.log("Detecting form fields");
        const fields = detectFields();

        sendResponse({
          success: true,
          fields
        });

        return true;
      }

      if (
        message.type === "FILL_FORM"
      ) {
        const profile =
          loadProfile();
        
        const results =
          fillForm(profile);

        const filled =
          results.filter(
            (result) => result.filled
          ).length;

        sendResponse({
          success: true,
          filled
        });

        return true;
      }

      sendResponse({
        success: false,
        error: "Unknown message type"
      });
    } catch (error) {
      sendResponse({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error"
      });
    }

    return true;
  }
);