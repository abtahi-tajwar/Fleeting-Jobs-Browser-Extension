import type { DetectedField } from "../shared/types";
import type { UserProfile } from "../shared/profile";
import mappings from "./fieldMappings.json";

export interface FieldMapping {
  path: string;
  value: string | boolean | null;
  confidence: number;
}

interface FieldMappingRule {
  path: string;
  confidence: number;
  matches?: string[];
  regex?: string[];
}

export function mapField(
  field: DetectedField,
  profile: UserProfile,
): FieldMapping | null {
  const text = normalize(
    [field.label, field.name, field.htmlId, field.placeholder]
      .filter(Boolean)
      .join(" "),
  );

  if (!text) {
    return null;
  }

  const rules = Object.values(mappings as Record<string, FieldMappingRule>);

  for (const rule of rules) {
    if (matchesRule(text, rule)) {
      return {
        path: rule.path,
        value: getValueByPath(profile, rule.path),
        confidence: rule.confidence,
      };
    }
  }

  return null;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[_-]/g, " ").replace(/\s+/g, " ").trim();
}

function getValueByPath(
  object: UserProfile,
  path: string,
): string | boolean | null {
  const value = path.split(".").reduce<unknown>((current, key) => {
    if (current !== null && typeof current === "object") {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, object);

  if (typeof value === "string" || typeof value === "boolean") {
    return value;
  }

  return null;
}

function matchesRule(text: string, rule: FieldMappingRule): boolean {
  // Literal matching
  if (rule.matches?.some((candidate) => text.includes(normalize(candidate)))) {
    return true;
  }

  // Regex matching
  if (
    rule.regex?.some((pattern) => {
      try {
        return new RegExp(pattern, "i").test(text);
      } catch (error) {
        console.warn(`Invalid regex in field mapping: ${pattern}`, error);

        return false;
      }
    })
  ) {
    return true;
  }

  return false;
}
