export type Platform =
  | "linkedin"
  | "twitter"
  | "newsletter"
  | "tiktok_script"
  | "instagram";

export interface PlatformConfig {
  id: Platform;
  label: string;
  description: string;
}

export interface GenerateRequest {
  inputText?: string;
  inputUrl?: string;
  platforms: Platform[];
}

export interface GeneratedResult {
  content: string;
}

export type GeneratedResults = Partial<Record<Platform, GeneratedResult>>;

export interface Generation {
  id: string;
  user_id: string;
  input_text: string | null;
  input_url: string | null;
  platforms: Platform[];
  generated_results: GeneratedResults;
  created_at: string;
}

export interface RateLimitInfo {
  allowed: boolean;
  remaining: number;
  limit: number;
}
