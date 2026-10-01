import type { DetectedField, FormFieldType } from "../shared/types";

export function detectFields(): DetectedField[] {
  const elements = Array.from(
    document.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >("input, textarea, select"),
  );

  return elements.map((element, index) => {
    return {
      id: `field-${index}`,

      type: getFieldType(element),

      name: element.getAttribute("name"),

      label: getLabel(element),

      placeholder: element.getAttribute("placeholder"),

      htmlId: element.getAttribute("id"),

      selector: createSelector(element),

      value: getValue(element),
    };
  });
}

function getFieldType(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): FormFieldType {
  if (element instanceof HTMLTextAreaElement) {
    return "textarea";
  }

  if (element instanceof HTMLSelectElement) {
    return "select";
  }

  switch (element.type) {
    case "text":
    case "":
      return "text";

    case "email":
      return "email";

    case "tel":
      return "tel";

    case "url":
      return "url";

    case "number":
      return "number";

    case "password":
      return "password";

    case "checkbox":
      return "checkbox";

    case "radio":
      return "radio";

    case "file":
      return "file";

    case "date":
      return "date";

    default:
      return "unknown";
  }
}

function getLabel(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): string | null {
  const id = element.getAttribute("id");

  if (id) {
    const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);

    if (label?.textContent?.trim()) {
      return label.textContent.trim();
    }
  }

  const parentLabel = element.closest("label");

  if (parentLabel?.textContent?.trim()) {
    return parentLabel.textContent.trim();
  }

  const ariaLabel = element.getAttribute("aria-label");

  if (ariaLabel?.trim()) {
    return ariaLabel.trim();
  }

  const labelledBy = element.getAttribute("aria-labelledby");

  if (labelledBy) {
    const labelElements = labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const text = labelElements
      .map((element) => element?.textContent?.trim())
      .filter(Boolean)
      .join(" ");

    if (text) {
      return text;
    }
  }

  return null;
}

function getValue(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): string | boolean | null {
  if (
    element instanceof HTMLInputElement &&
    (element.type === "checkbox" || element.type === "radio")
  ) {
    return element.checked;
  }

  return element.value || null;
}

function createSelector(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): string {
  const id = element.getAttribute("id");

  if (id) {
    return `#${CSS.escape(id)}`;
  }

  const name = element.getAttribute("name");

  if (name) {
    return `${element.tagName.toLowerCase()}[name="${CSS.escape(name)}"]`;
  }

  return element.tagName.toLowerCase();
}
