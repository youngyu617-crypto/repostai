import { createClient } from "@/lib/supabase/server";
import { HistoryList } from "@/components/history/history-list";
import type { Generation } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History - RepostAI",
  description: "Your past content generations.",
};

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: generations } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const count = generations?.length ?? 0;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {count > 0
            ? `${count} generation${count !== 1 ? "s" : ""}. Click to view or copy.`
            : "Your past generations will appear here."}
        </p>
      </div>
      <HistoryList generations={(generations as Generation[]) || []} />
    </div>
  );
}
