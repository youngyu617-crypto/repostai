import { describe, it, expect } from "vitest";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai/prompts";
import type { Platform } from "@/lib/types";

describe("buildSystemPrompt", () => {
  it("includes the RepostAI identity", () => {
    const prompt = buildSystemPrompt(["linkedin"]);
    expect(prompt).toContain("RepostAI");
    expect(prompt).toContain("creative and highly skilled content strategist");
  });

  it("includes no-fabrication rules", () => {
    const prompt = buildSystemPrompt(["twitter"]);
    expect(prompt).toContain("Never fabricate");
  });

  it("enforces natural and engaging tone", () => {
    const prompt = buildSystemPrompt(["linkedin"]);
    expect(prompt).toContain("emotionally engaging");
    expect(prompt).toContain("highly readable");
  });

  it("includes Twitter 280-char enforcement", () => {
    const prompt = buildSystemPrompt(["twitter"]);
    expect(prompt).toContain("under 280 characters");
  });

  it("includes platform-specific rules for selected platforms", () => {
    const prompt = buildSystemPrompt(["linkedin", "twitter"]);
    expect(prompt).toContain("**LinkedIn Post**");
    expect(prompt).toContain("**X/Twitter Thread**");
  });

  it("does not include rules for unselected platforms", () => {
    const prompt = buildSystemPrompt(["linkedin"]);
    expect(prompt).not.toContain("**Instagram Caption**");
    expect(prompt).not.toContain("**TikTok");
  });

  it("separates platform rules with dividers", () => {
    const prompt = buildSystemPrompt(["linkedin", "newsletter"]);
    expect(prompt).toContain("---");
  });

  it("includes all 5 platforms when all are selected", () => {
    const all: Platform[] = [
      "linkedin",
      "twitter",
      "newsletter",
      "tiktok_script",
      "instagram",
    ];
    const prompt = buildSystemPrompt(all);
    expect(prompt).toContain("**LinkedIn Post**");
    expect(prompt).toContain("**X/Twitter Thread**");
    expect(prompt).toContain("**Newsletter Summary**");
    expect(prompt).toContain("**TikTok / YouTube Shorts Script**");
    expect(prompt).toContain("**Instagram Caption**");
  });

  it("includes JSON output instructions in system prompt", () => {
    const prompt = buildSystemPrompt(["linkedin"]);
    expect(prompt).toContain("Output ONLY valid JSON");
    expect(prompt).toContain("Output ONLY the JSON object");
  });
});

describe("buildUserPrompt", () => {
  it("includes the content wrapped in markers", () => {
    const prompt = buildUserPrompt("My article content", ["linkedin"]);
    expect(prompt).toContain("--- ORIGINAL CONTENT START ---");
    expect(prompt).toContain("My article content");
    expect(prompt).toContain("--- ORIGINAL CONTENT END ---");
  });

  it("includes platform names in the instruction", () => {
    const prompt = buildUserPrompt("Content here", ["linkedin", "twitter"]);
    expect(prompt).toContain("Linkedin");
    expect(prompt).toContain("Twitter");
  });

  it("strips _script suffix from platform names", () => {
    const prompt = buildUserPrompt("Content here", ["tiktok_script"]);
    expect(prompt).toContain("Tiktok");
    expect(prompt).not.toContain("Tiktok_script");
  });

  it("includes source URL when provided", () => {
    const prompt = buildUserPrompt(
      "Content here",
      ["linkedin"],
      "https://example.com/post"
    );
    expect(prompt).toContain("Source URL: https://example.com/post");
  });

  it("does not include source URL when not provided", () => {
    const prompt = buildUserPrompt("Content here", ["linkedin"]);
    expect(prompt).not.toContain("Source URL:");
  });
});
