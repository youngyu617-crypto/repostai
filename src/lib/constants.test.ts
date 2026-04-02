import { describe, it, expect } from "vitest";
import {
  APP_NAME,
  FREE_DAILY_LIMIT,
  MAX_INPUT_LENGTH,
  MAX_URL_CONTENT_LENGTH,
  PLATFORMS,
} from "@/lib/constants";
import type { Platform } from "@/lib/types";

describe("constants", () => {
  it("APP_NAME is RepostAI", () => {
    expect(APP_NAME).toBe("RepostAI");
  });

  it("FREE_DAILY_LIMIT is a positive number", () => {
    expect(FREE_DAILY_LIMIT).toBeGreaterThan(0);
    expect(FREE_DAILY_LIMIT).toBe(3);
  });

  it("MAX_INPUT_LENGTH is reasonable", () => {
    expect(MAX_INPUT_LENGTH).toBe(50000);
  });

  it("MAX_URL_CONTENT_LENGTH is reasonable", () => {
    expect(MAX_URL_CONTENT_LENGTH).toBe(8000);
  });
});

describe("PLATFORMS", () => {
  it("has 5 platforms", () => {
    expect(PLATFORMS).toHaveLength(5);
  });

  it("contains all required platform IDs", () => {
    const ids = PLATFORMS.map((p) => p.id);
    const expected: Platform[] = [
      "linkedin",
      "twitter",
      "newsletter",
      "tiktok_script",
      "instagram",
    ];
    expect(ids).toEqual(expected);
  });

  it("each platform has id, label, and description", () => {
    for (const platform of PLATFORMS) {
      expect(platform.id).toBeTruthy();
      expect(platform.label).toBeTruthy();
      expect(platform.description).toBeTruthy();
    }
  });
});
