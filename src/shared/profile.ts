import profileData from "../mock/profile.json";

export interface UserProfile {
  personal: {
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    preferredName: string | null;
    email: string | null;
    phone: string | null;
    location: {
      city: string | null;
      province: string | null;
      country: string | null;
    };
    address: string | null;
    postalCode: string | null;
    linkedin: string | null;
    github: string | null;
    portfolio: string | null;
    website: string | null;
  };

  professional: {
    headline: string | null;
    yearsOfExperience: number | null;
    primaryRole: string | null;
    secondaryAreas: string[];
    salary: {
      minimum: number | null;
      target: number | null;
      currency: string | null;
      period: string | null;
    };
  };

  employment: Array<{
    company: string;
    role: string;
    employmentType: string | null;
    location: string | null;
    startDate: string | null;
    endDate: string | null;
    current: boolean;
    description: string | null;
    technologies?: string[];
  }>;

  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string | null;
    endDate: string | null;
    current: boolean;
    gpa?: string | null;
  }>;

  skills: Record<string, string[]>;

  projects: Array<{
    name: string;
    type: string;
    status: string;
    description: string;
    technologies: string[];
    features?: string[];
  }>;

  certifications: Array<{
    name: string;
    issuer: string;
    status: string;
    date: string | null;
  }>;

  research?: {
    areas: string[];
    thesis?: {
      title: string;
      topics: string[];
    };
  };

  additionalExperience?: Record<string, boolean>;

  jobPreferences?: {
    targetRoles: string[];
    preferredTechnologyAreas: string[];
  };
}

export function loadProfile(): UserProfile {
  return profileData as UserProfile;
}