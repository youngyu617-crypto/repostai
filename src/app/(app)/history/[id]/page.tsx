import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PLATFORMS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultTab } from "@/components/generator/result-tab";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";
import type { Generation } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generation Detail - RepostAI",
};

export default async function GenerationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: generation } = await supabase
    .from("generations")
    .select("*")
    .eq("id", id)
    .single();

  if (!generation) {
    notFound();
  }

  const gen = generation as Generation;
  const activePlatforms = PLATFORMS.filter((p) =>
    gen.platforms.includes(p.id)
  );
  const firstAvailable =
    activePlatforms.find((p) => gen.generated_results[p.id]?.content)?.id ??
    activePlatforms[0]?.id;
  const resultCount = Object.keys(gen.generated_results).length;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          render={<Link href="/history" />}
          nativeButton={false}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to History
        </Button>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {formatDate(gen.created_at)}
            </p>
            <span className="text-xs text-muted-foreground">
              {resultCount} platform{resultCount !== 1 ? "s" : ""}
            </span>
          </div>

          {gen.input_url && (
            <div className="flex items-center gap-1.5 text-sm">
              <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <a
                href={gen.input_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {gen.input_url}
              </a>
            </div>
          )}

          {gen.input_text && (
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                Show original input ({gen.input_text.length.toLocaleString()}{" "}
                characters)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg border bg-muted/30 p-3 text-xs leading-relaxed font-sans max-h-64 overflow-y-auto">
                {gen.input_text}
              </pre>
            </details>
          )}

          <div className="flex flex-wrap gap-1">
            {gen.platforms.map((platformId) => {
              const platform = PLATFORMS.find((p) => p.id === platformId);
              return (
                <Badge
                  key={platformId}
                  variant="secondary"
                  className="text-xs"
                >
                  {platform?.label || platformId}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      {activePlatforms.length > 0 && (
        <Tabs defaultValue={firstAvailable} className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
            {activePlatforms.map((platform) => (
              <TabsTrigger
                key={platform.id}
                value={platform.id}
                className="text-xs flex-1 min-w-[100px]"
              >
                {platform.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {activePlatforms.map((platform) => (
            <TabsContent key={platform.id} value={platform.id}>
              {gen.generated_results[platform.id]?.content ? (
                <ResultTab
                  platformLabel={platform.label}
                  content={gen.generated_results[platform.id]!.content}
                />
              ) : (
                <div className="rounded-lg border bg-muted/30 p-6">
                  <p className="text-sm text-muted-foreground">
                    No content available for this platform.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
