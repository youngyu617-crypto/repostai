import { createClient } from "@/lib/supabase/server";
import { FREE_DAILY_LIMIT } from "@/lib/constants";
import type { RateLimitInfo } from "@/lib/types";

export async function checkRateLimit(userId: string): Promise<RateLimitInfo> {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", today.toISOString());

  if (error) {
    console.error("Rate limit check error:", error);
    return { allowed: true, remaining: FREE_DAILY_LIMIT, limit: FREE_DAILY_LIMIT };
  }

  const used = count || 0;
  const remaining = Math.max(0, FREE_DAILY_LIMIT - used);

  return {
    allowed: remaining > 0,
    remaining,
    limit: FREE_DAILY_LIMIT,
  };
}
