export type FormFieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "password"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "file"
  | "date"
  | "unknown";

export interface DetectedField {
  id: string;

  type: FormFieldType;

  name: string | null;

  label: string | null;

  placeholder: string | null;

  htmlId: string | null;

  selector: string;

  value: string | boolean | null;
}
