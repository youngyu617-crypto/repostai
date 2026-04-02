import { z } from "zod";
import { MAX_INPUT_LENGTH } from "@/lib/constants";

export const requestSchema = z.object({
  inputText: z.string().max(MAX_INPUT_LENGTH).optional(),
  inputUrl: z.string().url().optional(),
  platforms: z
    .array(
      z.enum(["linkedin", "twitter", "newsletter", "tiktok_script", "instagram"])
    )
    .min(1, "Select at least one platform"),
});

/**
 * Static output schema — all platforms are optional.
 * streamObject only generates keys the LLM is prompted for,
 * so unused platforms simply won't appear in the output.
 */
const platformResultSchema = z.object({
  content: z.string().describe("The full formatted text for this platform"),
});

export const outputSchema = z.object({
  linkedin: platformResultSchema.optional().describe("LinkedIn post"),
  twitter: platformResultSchema.optional().describe("X/Twitter thread"),
  newsletter: platformResultSchema.optional().describe("Newsletter summary"),
  tiktok_script: platformResultSchema
    .optional()
    .describe("TikTok / YouTube Shorts script"),
  instagram: platformResultSchema.optional().describe("Instagram caption"),
});
