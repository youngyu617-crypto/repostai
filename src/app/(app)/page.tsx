import { GeneratorForm } from "@/components/generator/generator-form";
import { createClient } from "@/lib/supabase/server";
import { FREE_DAILY_LIMIT } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let remaining = FREE_DAILY_LIMIT;

  if (user) {
    // Use UTC midnight for consistent day boundary regardless of server timezone
    const now = new Date();
    const todayUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    const { count } = await supabase
      .from("generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayUtc.toISOString());

    remaining = Math.max(0, FREE_DAILY_LIMIT - (count || 0));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-20">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.15]">
          Turn one long content into perfectly formatted posts for every
          platform{" "}
          <span className="text-primary">— instantly.</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
          RepostAI helps creators repurpose blogs, articles, transcripts,
          and video descriptions into LinkedIn posts, X threads,
          newsletters, TikTok scripts, and Instagram captions in seconds.
        </p>
      </div>

      {/* How it works */}
      <div className="mb-12 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
          <span className="font-semibold text-foreground">1</span> Paste
          content
        </span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 hidden sm:block" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
          <span className="font-semibold text-foreground">2</span> Pick
          platforms
        </span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 hidden sm:block" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
          <span className="font-semibold text-foreground">3</span> Copy &
          post
        </span>
      </div>

      {/* Generator */}
      <GeneratorForm
        isAuthenticated={!!user}
        initialRemaining={remaining}
      />

      {/* Note */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Free: {FREE_DAILY_LIMIT} generations per day. Sign in with Google to
        start generating.
      </p>
    </div>
  );
}
