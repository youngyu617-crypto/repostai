"use client";

import { PLATFORMS } from "@/lib/constants";
import type { Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
  disabled: boolean;
}

export function PlatformSelector({
  selected,
  onChange,
  disabled,
}: PlatformSelectorProps) {
  const allSelected = selected.length === PLATFORMS.length;

  function togglePlatform(id: Platform) {
    if (selected.includes(id)) {
      onChange(selected.filter((p) => p !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  function toggleAll() {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(PLATFORMS.map((p) => p.id));
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          Platforms{" "}
          <span className="font-normal text-muted-foreground">
            ({selected.length} selected)
          </span>
        </p>
        <button
          type="button"
          onClick={toggleAll}
          disabled={disabled}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          {allSelected ? "Deselect All" : "Select All"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((platform) => {
          const isSelected = selected.includes(platform.id);
          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => togglePlatform(platform.id)}
              disabled={disabled}
              title={platform.description}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all disabled:opacity-50",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {platform.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
