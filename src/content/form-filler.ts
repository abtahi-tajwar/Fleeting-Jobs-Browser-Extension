import type { UserProfile } from "../shared/profile";
import { mapField } from "./field-mapper";
import {
  detectDomFields,
  type FormElement,
} from "./field-detector";

export interface FillResult {
  fieldId: string;
  path: string | null;
  value: string | boolean | null;
  filled: boolean;
  reason?: string;
}

export function fillForm(profile: UserProfile): FillResult[] {
  const fields = detectDomFields();

  return fields.map(({ field, element }) => {
    const mapping = mapField(field, profile);

    if (!mapping) {
      return {
        fieldId: field.id,
        path: null,
        value: null,
        filled: false,
        reason: "No profile mapping found",
      };
    }

    if (mapping.value == null) {
      return {
        fieldId: field.id,
        path: mapping.path,
        value: null,
        filled: false,
        reason: "Profile value is empty",
      };
    }

    fillElement(element, mapping.value);

    return {
      fieldId: field.id,
      path: mapping.path,
      value: mapping.value,
      filled: true,
    };
  });
}

function fillElement(
  element: FormElement,
  value: string | boolean,
): void {
  if (
    element instanceof HTMLInputElement &&
    (element.type === "checkbox" ||
      element.type === "radio")
  ) {
    setChecked(element, Boolean(value));
    return;
  }

  setInputValue(element, String(value));
}

function setInputValue(
  element: HTMLInputElement |
    HTMLTextAreaElement |
    HTMLSelectElement,
  value: string,
): void {
  const prototype = Object.getPrototypeOf(element);

  const descriptor = Object.getOwnPropertyDescriptor(
    prototype,
    "value",
  );

  if (descriptor?.set) {
    descriptor.set.call(element, value);
  } else {
    element.value = value;
  }

  dispatchInputEvents(element);
}

function setChecked(
  element: HTMLInputElement,
  checked: boolean,
): void {
  element.checked = checked;

  element.dispatchEvent(
    new Event("input", {
      bubbles: true,
    }),
  );

  element.dispatchEvent(
    new Event("change", {
      bubbles: true,
    }),
  );
}

function dispatchInputEvents(
  element: FormElement,
): void {
  element.dispatchEvent(
    new Event("input", {
      bubbles: true,
    }),
  );

  element.dispatchEvent(
    new Event("change", {
      bubbles: true,
    }),
  );

  element.dispatchEvent(
    new Event("blur", {
      bubbles: true,
    }),
  );
}