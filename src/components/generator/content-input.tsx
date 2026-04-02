"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Link as LinkIcon } from "lucide-react";
import { MAX_INPUT_LENGTH } from "@/lib/constants";

interface ContentInputProps {
  inputText: string;
  inputUrl: string;
  inputMode: "text" | "url";
  onTextChange: (text: string) => void;
  onUrlChange: (url: string) => void;
  onModeChange: (mode: "text" | "url") => void;
  disabled: boolean;
}

export function ContentInput({
  inputText,
  inputUrl,
  inputMode,
  onTextChange,
  onUrlChange,
  onModeChange,
  disabled,
}: ContentInputProps) {
  const charCount = inputText.length;
  const isTooShort = inputMode === "text" && charCount > 0 && charCount < 50;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Content Source</p>
        <div className="flex gap-1.5">
          <Button
            variant={inputMode === "text" ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange("text")}
            type="button"
            className="text-xs"
          >
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Paste Text
          </Button>
          <Button
            variant={inputMode === "url" ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange("url")}
            type="button"
            className="text-xs"
          >
            <LinkIcon className="mr-1.5 h-3.5 w-3.5" />
            Enter URL
          </Button>
        </div>
      </div>

      {inputMode === "text" ? (
        <div className="space-y-1.5">
          <div className="relative">
            <Textarea
              placeholder="Paste your long-form content here... (blog post, article, transcript, notes)"
              value={inputText}
              onChange={(e) => onTextChange(e.target.value)}
              disabled={disabled}
              className="min-h-[200px] resize-y text-sm"
              maxLength={MAX_INPUT_LENGTH}
            />
            <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
              {charCount.toLocaleString()} / {MAX_INPUT_LENGTH.toLocaleString()}
            </span>
          </div>
          {isTooShort && (
            <p className="text-xs text-muted-foreground">
              Minimum 50 characters required ({50 - charCount} more needed)
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <Input
            type="url"
            placeholder="https://example.com/blog-post or YouTube URL"
            value={inputUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={disabled}
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Supports blog posts, articles, and YouTube/podcast URLs (title +
            description)
          </p>
        </div>
      )}
    </div>
  );
}
