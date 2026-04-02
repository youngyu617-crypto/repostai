"use client";

import { useState } from "react";
import { ContentInput } from "@/components/generator/content-input";
import { PlatformSelector } from "@/components/generator/platform-selector";
import { GenerateButton } from "@/components/generator/generate-button";
import { ResultsPanel } from "@/components/generator/results-panel";
import { useGeneration } from "@/hooks/use-generation";
import { saveGeneration } from "@/actions/generate";
import { PLATFORMS, FREE_DAILY_LIMIT } from "@/lib/constants";
import type { Platform } from "@/lib/types";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface GeneratorFormProps {
  isAuthenticated: boolean;
  initialRemaining?: number;
}

export function GeneratorForm({
  isAuthenticated,
  initialRemaining,
}: GeneratorFormProps) {
  const [inputMode, setInputMode] = useState<"text" | "url">("text");
  const [inputText, setInputText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(
    PLATFORMS.map((p) => p.id)
  );
  const [remaining, setRemaining] = useState(
    initialRemaining ?? FREE_DAILY_LIMIT
  );

  const { isLoading, error, results, generate, reset } = useGeneration();

  const hasInput =
    inputMode === "text"
      ? inputText.trim().length >= 50
      : inputUrl.trim().length > 0;
  const canGenerate =
    isAuthenticated &&
    hasInput &&
    selectedPlatforms.length > 0 &&
    !isLoading &&
    remaining > 0;

  async function handleGenerate() {
    if (!isAuthenticated) {
      toast.error("Please sign in to generate content.", {
        action: {
          label: "Sign In",
          onClick: () => {
            window.location.href = "/login";
          },
        },
      });
      return;
    }

    if (remaining <= 0) {
      toast.error("Daily limit reached. Upgrade for unlimited access.");
      return;
    }

    const data = {
      inputText: inputMode === "text" ? inputText : undefined,
      inputUrl: inputMode === "url" ? inputUrl : undefined,
      platforms: selectedPlatforms,
    };

    const generatedResults = await generate(data);

    if (generatedResults) {
      setRemaining((prev) => Math.max(0, prev - 1));
      toast.success("Content generated successfully!");

      await saveGeneration({
        inputText: data.inputText,
        inputUrl: data.inputUrl,
        platforms: selectedPlatforms,
        generatedResults,
      });
    }
  }

  function handleReset() {
    reset();
    setInputText("");
    setInputUrl("");
  }

  return (
    <div className="space-y-6">
      <Card className="border shadow-sm">
        <CardContent className="space-y-5 pt-6">
          <ContentInput
            inputText={inputText}
            inputUrl={inputUrl}
            inputMode={inputMode}
            onTextChange={setInputText}
            onUrlChange={setInputUrl}
            onModeChange={setInputMode}
            disabled={isLoading}
          />

          <PlatformSelector
            selected={selectedPlatforms}
            onChange={setSelectedPlatforms}
            disabled={isLoading}
          />

          <div className="flex items-center justify-between">
            <GenerateButton
              isLoading={isLoading}
              disabled={!canGenerate}
              remaining={isAuthenticated ? remaining : undefined}
              onClick={handleGenerate}
            />
            {results && !isLoading && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear & start over
              </button>
            )}
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground">
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>{" "}
              to start generating content.
            </p>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {remaining === 0 && isAuthenticated && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-medium">Daily limit reached</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You&apos;ve used all {FREE_DAILY_LIMIT} free generations today.
                Upgrade to Pro for unlimited generations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <ResultsPanel
        results={results}
        platforms={selectedPlatforms}
        isLoading={isLoading}
      />
    </div>
  );
}
