import { streamObject } from "ai";
import { getModel } from "@/lib/ai/model";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai/prompts";
import { requestSchema, outputSchema } from "@/lib/ai/schemas";
import { extractUrlContent } from "@/lib/ai/extract-url";
import { checkRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import type { Platform } from "@/lib/types";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json(
        { error: "Please sign in to generate content." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { inputText, inputUrl, platforms } = parsed.data;

    if (!inputText && !inputUrl) {
      return Response.json(
        { error: "Please provide text content or a URL." },
        { status: 400 }
      );
    }

    // Rate limit check
    const rateLimit = await checkRateLimit(user.id);
    if (!rateLimit.allowed) {
      return Response.json(
        {
          error: `Daily limit reached (${rateLimit.limit} generations per day). Upgrade for unlimited access.`,
          remaining: 0,
          limit: rateLimit.limit,
        },
        { status: 429 }
      );
    }

    // Get content
    let content = inputText || "";
    let sourceUrl: string | undefined;

    if (inputUrl) {
      try {
        const extracted = await extractUrlContent(inputUrl);
        content = `Title: ${extracted.title}\n\n${extracted.content}`;
        sourceUrl = inputUrl;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to extract content from URL.";
        return Response.json({ error: message }, { status: 400 });
      }
    }

    if (content.trim().length < 50) {
      return Response.json(
        {
          error: "Content is too short. Please provide at least 50 characters.",
        },
        { status: 400 }
      );
    }

    const typedPlatforms = platforms as Platform[];

    const result = streamObject({
      model: getModel(),
      schema: outputSchema,
      system: buildSystemPrompt(typedPlatforms),
      prompt: buildUserPrompt(content, typedPlatforms, sourceUrl),
      temperature: 0.3,
      maxOutputTokens: 8192,
      onError: (error) => {
        console.error("Stream error:", error);
      },
    });

    // Stream partial objects as NDJSON for reliable client-side parsing.
    // Each line is a complete, valid JSON partial object.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const partialObject of result.partialObjectStream) {
            controller.enqueue(
              encoder.encode(JSON.stringify(partialObject) + "\n")
            );
          }
        } catch (err) {
          console.error("Stream iteration error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Generate error:", err);
    return Response.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
