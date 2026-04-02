import { type PlatformConfig } from "./types";

export const APP_NAME = "RepostAI";

export const FREE_DAILY_LIMIT = 3;

export const MAX_INPUT_LENGTH = 50000;

export const MAX_URL_CONTENT_LENGTH = 8000;

export const PLATFORMS: PlatformConfig[] = [
  {
    id: "linkedin",
    label: "LinkedIn Post",
    description: "Professional, insightful long-form post",
  },
  {
    id: "twitter",
    label: "X / Twitter Thread",
    description: "Punchy numbered thread with hooks",
  },
  {
    id: "newsletter",
    label: "Newsletter Summary",
    description: "Email-friendly summary with key takeaways",
  },
  {
    id: "tiktok_script",
    label: "TikTok / Shorts Script",
    description: "Energetic spoken-style 30-60s script",
  },
  {
    id: "instagram",
    label: "Instagram Caption",
    description: "Engaging caption with emojis and hashtags",
  },
];
