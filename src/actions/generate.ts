"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { GeneratedResults, Platform } from "@/lib/types";

export async function saveGeneration(data: {
  inputText?: string;
  inputUrl?: string;
  platforms: Platform[];
  generatedResults: GeneratedResults;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("generations").insert({
    user_id: user.id,
    input_text: data.inputText || null,
    input_url: data.inputUrl || null,
    platforms: data.platforms,
    generated_results: data.generatedResults,
  });

  revalidatePath("/history");
}
