"use client";

import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ResultTabProps {
  platformLabel: string;
  content: string;
}

export function ResultTab({ platformLabel, content }: ResultTabProps) {
  function handleExport() {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${platformLabel.toLowerCase().replace(/[\s/]+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CopyButton text={content} />
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Export .txt
        </Button>
      </div>
      <div className="rounded-lg border bg-muted/30 p-4">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
          {content}
        </pre>
      </div>
    </div>
  );
}
