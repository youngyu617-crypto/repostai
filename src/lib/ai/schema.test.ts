import { describe, it, expect } from "vitest";
import { outputSchema, requestSchema } from "@/lib/ai/schemas";

describe("outputSchema", () => {
  it("accepts a valid full result", () => {
    const data = {
      linkedin: { content: "LinkedIn post here" },
      twitter: { content: "Thread tweet 1\n\nTweet 2" },
      newsletter: { content: "Newsletter content" },
      tiktok_script: { content: "TikTok script" },
      instagram: { content: "Instagram caption" },
    };
    const result = outputSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("accepts partial results (only some platforms)", () => {
    const data = {
      linkedin: { content: "Just LinkedIn" },
    };
    const result = outputSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("accepts empty object (all platforms optional)", () => {
    const result = outputSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects invalid platform content (missing content field)", () => {
    const data = {
      linkedin: { text: "wrong field name" },
    };
    const result = outputSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects non-string content", () => {
    const data = {
      linkedin: { content: 123 },
    };
    const result = outputSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe("requestSchema", () => {
  it("accepts valid text input with platforms", () => {
    const result = requestSchema.safeParse({
      inputText: "Some content",
      platforms: ["linkedin"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid URL input with platforms", () => {
    const result = requestSchema.safeParse({
      inputUrl: "https://example.com",
      platforms: ["twitter", "instagram"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty platforms array", () => {
    const result = requestSchema.safeParse({
      inputText: "Content",
      platforms: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid platform ID", () => {
    const result = requestSchema.safeParse({
      inputText: "Content",
      platforms: ["facebook"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid URL format", () => {
    const result = requestSchema.safeParse({
      inputUrl: "not-a-url",
      platforms: ["linkedin"],
    });
    expect(result.success).toBe(false);
  });

  it("accepts all 5 platforms at once", () => {
    const result = requestSchema.safeParse({
      inputText: "Content",
      platforms: [
        "linkedin",
        "twitter",
        "newsletter",
        "tiktok_script",
        "instagram",
      ],
    });
    expect(result.success).toBe(true);
  });
});
