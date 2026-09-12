export type ProjectStatus =
  | "LIVE"
  | "PRODUCTION"
  | "IN DEVELOPMENT"
  | "ARCHIVED"
  | "EXPERIMENT";
export type RepositoryVisibility = "public" | "private" | "none";
export interface Project {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: ProjectStatus;
  year: number;
  summary: string;
  description?: string;
  role?: string;
  architecture?: string;
  stack?: string[];
  challenges?: string[];
  solutions?: string[];
  highlights?: string[];
  learnings?: string[];
  screenshots?: { src: string; alt: string }[];
  gallery?: { src: string; alt: string }[];
  liveUrl?: string | null;
  repositoryUrl?: string | null;
  repositoryVisibility: RepositoryVisibility;
  featured: boolean;
  placeholder: boolean;
}
