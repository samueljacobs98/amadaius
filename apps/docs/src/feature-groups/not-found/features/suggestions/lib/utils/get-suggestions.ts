import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";
import type { Suggestion } from "../types";

const { search } = createFromSource(source, {
  language: "english",
});

export async function getSuggestions(pathname: string): Promise<Suggestion[]> {
  if (!pathname) return [];

  try {
    const searchTerms = pathname.split("/").filter(Boolean).join(" ").trim();

    if (!searchTerms) return [];

    const results = await search(searchTerms, {
      mode: "full",
    });

    return results.map((hit) => ({
      id: hit.id,
      href: hit.url,
      title: hit.breadcrumbs?.join(" / "),
    }));
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}
