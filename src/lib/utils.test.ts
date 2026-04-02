import { describe, it, expect } from "vitest";
import { cn, formatDate } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("deduplicates conflicting tailwind classes", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "text-sm")).toBe("base text-sm");
  });

  it("handles undefined and null inputs", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("formatDate", () => {
  it("formats a valid ISO date string", () => {
    const result = formatDate("2025-06-15T14:30:00Z");
    // Should contain month, day, year
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2025/);
  });

  it("includes time components", () => {
    const result = formatDate("2025-01-01T00:00:00Z");
    // Should include some time representation
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });
});
