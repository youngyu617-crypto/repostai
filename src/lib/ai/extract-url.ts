import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { MAX_URL_CONTENT_LENGTH } from "@/lib/constants";

export interface ExtractedContent {
  title: string;
  content: string;
}

export async function extractUrlContent(
  url: string
): Promise<ExtractedContent> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; RepostAI/1.0; +https://repostai.com)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(10000),
  });

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html") && !contentType.includes("text/xml") && !contentType.includes("application/xhtml")) {
    throw new Error(
      "URL does not point to an HTML page. Please paste the content directly."
    );
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article || !article.textContent || article.textContent.trim().length < 100) {
    // Fallback: try to get title + meta description
    const title =
      dom.window.document.querySelector("title")?.textContent || "";
    const metaDesc =
      dom.window.document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") || "";
    const ogDesc =
      dom.window.document
        .querySelector('meta[property="og:description"]')
        ?.getAttribute("content") || "";

    const fallbackContent = [title, metaDesc || ogDesc].filter(Boolean).join("\n\n");

    if (fallbackContent.length < 50) {
      throw new Error(
        "Could not extract meaningful content from this URL. The page may be paywalled or dynamically loaded. Please paste the content directly."
      );
    }

    return {
      title: title || "Untitled",
      content: fallbackContent.slice(0, MAX_URL_CONTENT_LENGTH),
    };
  }

  return {
    title: article.title || "Untitled",
    content: article.textContent.trim().slice(0, MAX_URL_CONTENT_LENGTH),
  };
}
