export type CapabilityCategory =
  | "Software Development"
  | "Backend & Database"
  | "Infrastructure"
  | "IT Support"
  | "Mobile"
  | "Game Development"
  | "Tools & Workflow";
export type CapabilityLevel =
  | "Learning"
  | "Familiar"
  | "Practical Experience"
  | "Project Experience";
export interface Capability {
  id: string;
  name: string;
  category: CapabilityCategory;
  level: CapabilityLevel;
  summary: string;
  evidence: string[];
  relatedExperience: string[];
  relatedProjects: string[];
  status: "verified" | "learning";
}
