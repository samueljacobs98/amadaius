"use client";

import {
  type ComponentProps,
  type ComponentType,
  createContext,
  type ReactNode,
  use,
} from "react";
import Link from "next/link";
import { Button } from "@frontend/ui/components";
import type { Suggestion as SuggestionType } from "../lib/types";

const SuggestionContext = createContext<{
  suggestions: SuggestionType[];
} | null>(null);

export function Suggestions({
  suggestions,
  children,
}: {
  suggestions: SuggestionType[];
  children: ReactNode | ((suggestions: SuggestionType[]) => ReactNode);
}) {
  return (
    <SuggestionContext.Provider value={{ suggestions }}>
      {typeof children === "function" ? children(suggestions) : children}
    </SuggestionContext.Provider>
  );
}

export function useSuggestions() {
  const context = use(SuggestionContext);

  if (!context) {
    throw new Error("useSuggestions must be used within a SuggestionsProvider");
  }

  return context;
}

export function NoSuggestions() {
  const { suggestions } = useSuggestions();

  if (suggestions.length > 0) {
    return null;
  }

  return (
    <Button asChild>
      <Link href="/">Return to Home</Link>
    </Button>
  );
}

export function Suggestion({ suggestion }: { suggestion: SuggestionType }) {
  return (
    <Button asChild>
      <Link
        href={suggestion.href}
        className="bg-fd-card text-fd-card-foreground hover:bg-fd-accent hover:text-fd-accent-foreground block rounded-lg border p-3 text-sm shadow-md transition-colors"
      >
        {suggestion.title}
      </Link>
    </Button>
  );
}

export function SuggestionList({
  suggestionComponent: SuggestionComponent,
}: {
  suggestionComponent: ComponentType<ComponentProps<typeof Suggestion>>;
}) {
  const { suggestions } = useSuggestions();

  return (
    <div className="flex flex-col gap-2">
      {suggestions.map((suggestion) => (
        <SuggestionComponent key={suggestion.id} suggestion={suggestion} />
      ))}
    </div>
  );
}

export function TopSuggestion() {
  const { suggestions } = useSuggestions();

  const topSuggestion = suggestions[0];

  if (!topSuggestion) {
    return null;
  }

  return <Suggestion suggestion={topSuggestion} />;
}
