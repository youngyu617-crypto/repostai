"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface GenerateButtonProps {
  isLoading: boolean;
  disabled: boolean;
  remaining?: number;
  onClick: () => void;
}

export function GenerateButton({
  isLoading,
  disabled,
  remaining,
  onClick,
}: GenerateButtonProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        size="lg"
        className="px-8"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate
          </>
        )}
      </Button>
      {remaining !== undefined && (
        <span className="text-xs text-muted-foreground">
          {remaining} generation{remaining !== 1 ? "s" : ""} remaining today
        </span>
      )}
    </div>
  );
}
