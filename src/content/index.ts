import { ExtensionMessage, ExtensionResponse } from "../shared/messages";
import { detectFields } from "./field-detector";

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: ExtensionResponse) => void
  ) => {
    if (message.type === "DETECT_FIELDS") {
      try {
        const fields = detectFields();

        sendResponse({
          success: true,
          fields
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
    }

    return true;
  }
);