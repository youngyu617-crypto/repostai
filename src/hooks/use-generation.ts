"use client";

import { useState, useCallback } from "react";
import type { GeneratedResults, Platform } from "@/lib/types";

interface UseGenerationReturn {
  isLoading: boolean;
  error: string | null;
  results: GeneratedResults | null;
  generate: (data: {
    inputText?: string;
    inputUrl?: string;
    platforms: Platform[];
  }) => Promise<GeneratedResults | null>;
  reset: () => void;
}

function normalizeResults(parsed: Record<string, unknown>): GeneratedResults {
  const results: GeneratedResults = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === "object" && value !== null && "content" in value) {
      const content = (value as { content: unknown }).content;
      if (typeof content === "string" && content.length > 0) {
        results[key as Platform] = { content };
      }
    } else if (typeof value === "string" && value.length > 0) {
      results[key as Platform] = { content: value };
    }
  }

  return results;
}

export function useGeneration(): UseGenerationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedResults | null>(null);

  const generate = useCallback(
    async (data: {
      inputText?: string;
      inputUrl?: string;
      platforms: Platform[];
    }): Promise<GeneratedResults | null> => {
      setIsLoading(true);
      setError(null);
      setResults(null);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Generation failed.");
          setIsLoading(false);
          return null;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          setError("Failed to read response stream.");
          setIsLoading(false);
          return null;
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let latestResults: GeneratedResults | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete NDJSON lines
          const lines = buffer.split("\n");
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
              const partialObject = JSON.parse(trimmed);
              const partial = normalizeResults(
                partialObject as Record<string, unknown>
              );
              if (Object.keys(partial).length > 0) {
                latestResults = partial;
                setResults(partial);
              }
            } catch {
              // Skip malformed lines
            }
          }
        }

        // Process any remaining buffer
        if (buffer.trim()) {
          try {
            const finalObject = JSON.parse(buffer.trim());
            const finalResults = normalizeResults(
              finalObject as Record<string, unknown>
            );
            if (Object.keys(finalResults).length > 0) {
              latestResults = finalResults;
              setResults(finalResults);
            }
          } catch {
            // Final buffer not valid JSON
          }
        }

        if (latestResults && Object.keys(latestResults).length > 0) {
          setIsLoading(false);
          return latestResults;
        }

        setError("Failed to parse generated content. Please try again.");
        setIsLoading(false);
        return null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
        setIsLoading(false);
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return { isLoading, error, results, generate, reset };
}
