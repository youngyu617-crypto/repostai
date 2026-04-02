"use client";

import { HistoryCard } from "@/components/history/history-card";
import type { Generation } from "@/lib/types";
import Link from "next/link";

interface HistoryListProps {
  generations: Generation[];
}

export function HistoryList({ generations }: HistoryListProps) {
  if (generations.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No generations yet.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            Generate your first content
          </Link>{" "}
          and it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {generations.map((generation) => (
        <HistoryCard key={generation.id} generation={generation} />
      ))}
    </div>
  );
}
