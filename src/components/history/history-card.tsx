"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PLATFORMS } from "@/lib/constants";
import { deleteGeneration } from "@/actions/history";
import { toast } from "sonner";
import Link from "next/link";
import type { Generation } from "@/lib/types";
import { useState } from "react";

interface HistoryCardProps {
  generation: Generation;
}

export function HistoryCard({ generation }: HistoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const preview =
    generation.input_text?.slice(0, 120) ||
    generation.input_url ||
    "No input";
  const resultCount = Object.keys(generation.generated_results).length;

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteGeneration(generation.id);
    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      setIsDeleted(true);
      toast.success("Generation deleted.");
    }
  }

  if (isDeleted) return null;

  return (
    <Card className="group border shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link href={`/history/${generation.id}`} className="block">
              <p className="text-sm truncate text-foreground group-hover:text-primary transition-colors">
                {preview}
                {generation.input_text && generation.input_text.length > 120 && "..."}
              </p>
            </Link>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatDate(generation.created_at)}</span>
              <span>&middot;</span>
              <span>
                {resultCount} platform{resultCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {generation.platforms.map((platformId) => {
                const platform = PLATFORMS.find((p) => p.id === platformId);
                return (
                  <Badge
                    key={platformId}
                    variant="secondary"
                    className="text-[10px]"
                  >
                    {platform?.label || platformId}
                  </Badge>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              render={<Link href={`/history/${generation.id}`} />}
              nativeButton={false}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
