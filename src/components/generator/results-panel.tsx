"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultTab } from "@/components/generator/result-tab";
import { PLATFORMS } from "@/lib/constants";
import type { GeneratedResults, Platform } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

interface ResultsPanelProps {
  results: GeneratedResults | null;
  platforms: Platform[];
  isLoading: boolean;
}

export function ResultsPanel({
  results,
  platforms,
  isLoading,
}: ResultsPanelProps) {
  if (!results && !isLoading) return null;

  const activePlatforms = PLATFORMS.filter((p) => platforms.includes(p.id));
  const hasAnyResult = results && Object.keys(results).length > 0;

  // Show tabs as soon as we have partial results (even while loading)
  if (hasAnyResult) {
    const completedCount = Object.keys(results).length;
    const firstAvailable =
      activePlatforms.find((p) => results[p.id]?.content)?.id ??
      activePlatforms[0]?.id;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Generated Content</h2>
            {isLoading ? (
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  Generating...
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
                <span className="text-xs text-muted-foreground">
                  {completedCount} platform{completedCount !== 1 ? "s" : ""}{" "}
                  ready
                </span>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue={firstAvailable} className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
            {activePlatforms.map((platform) => {
              const hasContent = !!results[platform.id]?.content;
              return (
                <TabsTrigger
                  key={platform.id}
                  value={platform.id}
                  className="text-xs flex-1 min-w-[100px]"
                >
                  {platform.label}
                  {hasContent && !isLoading && (
                    <CheckCircle2 className="ml-1 h-3 w-3 text-green-600 dark:text-green-500" />
                  )}
                  {!hasContent && isLoading && (
                    <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse" />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {activePlatforms.map((platform) => (
            <TabsContent key={platform.id} value={platform.id}>
              {results[platform.id]?.content ? (
                <ResultTab
                  platformLabel={platform.label}
                  content={results[platform.id]!.content}
                />
              ) : isLoading ? (
                <div className="rounded-lg border bg-muted/30 p-6">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-sm text-muted-foreground">
                      Generating {platform.label}...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border bg-muted/30 p-6">
                  <p className="text-sm text-muted-foreground">
                    No content generated for this platform.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }

  // Initial loading state — no results parsed yet
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Generated Content</h2>
        <div className="rounded-lg border bg-muted/30 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Generating content for {platforms.length} platform
              {platforms.length > 1 ? "s" : ""}...
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activePlatforms.map((platform) => (
              <span
                key={platform.id}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {platform.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
