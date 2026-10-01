import type { DetectedField, FormFieldType } from "../shared/types";

export type FormElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;
export interface DetectedDomField {
  field: DetectedField;
  element: FormElement;
}
const FORM_FIELD_SELECTOR = "input, textarea, select";

export function detectDomFields(): DetectedDomField[] {
  const elements = Array.from(
    document.querySelectorAll<FormElement>(FORM_FIELD_SELECTOR),
  );

  return elements.map((element, index) => ({
    field: {
      id: `field-${index}`,
      type: getFieldType(element),
      name: element.getAttribute("name"),
      label: getLabel(element),
      placeholder: element.getAttribute("placeholder"),
      htmlId: element.getAttribute("id"),
      selector: createSelector(element),
      value: getValue(element),
    },
    element,
  }));
}

export function detectFields(): DetectedField[] {
  return detectDomFields().map(({ field }) => field);
}

function getFieldType(
  element: FormElement,
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
  element: FormElement,
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
