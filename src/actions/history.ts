"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteGeneration(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("generations")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/history");
  return { success: true };
}
