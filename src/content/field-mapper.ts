import type { DetectedField } from "../shared/types";
import type { UserProfile } from "../shared/profile";

export interface FieldMapping {
  path: string;
  value: string | boolean | null;
  confidence: number;
}

export function mapField(
  field: DetectedField,
  profile: UserProfile
): FieldMapping | null {
  const text = normalize(
    [
      field.label,
      field.name,
      field.htmlId,
      field.placeholder
    ]
      .filter(Boolean)
      .join(" ")
  );

  if (!text) {
    return null;
  }

  /*
   * Email
   */
  if (
    field.type === "email" ||
    matches(text, [
      "email",
      "email address",
      "e-mail"
    ])
  ) {
    return {
      path: "personal.email",
      value: profile.personal.email,
      confidence: 1
    };
  }

  /*
   * Phone
   */
  if (
    field.type === "tel" ||
    matches(text, [
      "phone",
      "phone number",
      "telephone",
      "mobile",
      "cell"
    ])
  ) {
    return {
      path: "personal.phone",
      value: profile.personal.phone,
      confidence: 1
    };
  }

  /*
   * First name
   */
  if (
    matches(text, [
      "first name",
      "firstname",
      "given name",
      "forename"
    ])
  ) {
    return {
      path: "personal.firstName",
      value: profile.personal.firstName,
      confidence: 0.98
    };
  }

  /*
   * Last name
   */
  if (
    matches(text, [
      "last name",
      "lastname",
      "surname",
      "family name"
    ])
  ) {
    return {
      path: "personal.lastName",
      value: profile.personal.lastName,
      confidence: 0.98
    };
  }

  /*
   * Full name
   */
  if (
    matches(text, [
      "full name",
      "complete name"
    ])
  ) {
    return {
      path: "personal.fullName",
      value: profile.personal.fullName,
      confidence: 0.95
    };
  }

  /*
   * LinkedIn
   */
  if (
    matches(text, [
      "linkedin",
      "linkedin profile",
      "linkedin url",
      "linkedin profile url"
    ])
  ) {
    return {
      path: "personal.linkedin",
      value: profile.personal.linkedin,
      confidence: 0.98
    };
  }

  /*
   * GitHub
   */
  if (
    matches(text, [
      "github",
      "github profile",
      "github url"
    ])
  ) {
    return {
      path: "personal.github",
      value: profile.personal.github,
      confidence: 0.98
    };
  }

  /*
   * Portfolio / website
   */
  if (
    matches(text, [
      "portfolio",
      "portfolio url",
      "personal website",
      "website"
    ])
  ) {
    return {
      path: "personal.portfolio",
      value: profile.personal.portfolio,
      confidence: 0.95
    };
  }

  /*
   * City
   */
  if (
    matches(text, [
      "city",
      "town"
    ])
  ) {
    return {
      path: "personal.location.city",
      value: profile.personal.location.city,
      confidence: 0.9
    };
  }

  /*
   * Province / State
   */
  if (
    matches(text, [
      "province",
      "state",
      "state/province",
      "region"
    ])
  ) {
    return {
      path: "personal.location.province",
      value: profile.personal.location.province,
      confidence: 0.9
    };
  }

  /*
   * Country
   */
  if (
    matches(text, [
      "country",
      "country of residence"
    ])
  ) {
    return {
      path: "personal.location.country",
      value: profile.personal.location.country,
      confidence: 0.9
    };
  }

  /*
   * Postal code
   */
  if (
    matches(text, [
      "postal code",
      "zip code",
      "zipcode",
      "zip"
    ])
  ) {
    return {
      path: "personal.postalCode",
      value: profile.personal.postalCode,
      confidence: 0.95
    };
  }

  return null;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matches(
  text: string,
  candidates: string[]
): boolean {
  return candidates.some((candidate) =>
    text.includes(normalize(candidate))
  );
}