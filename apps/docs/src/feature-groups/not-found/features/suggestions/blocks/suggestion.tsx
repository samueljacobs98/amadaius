import { NoSuggestions, Suggestions, TopSuggestion } from "../components";
import { getSuggestions } from "../lib/utils";

export async function SuggestionBlock({ path }: { path: string }) {
  const suggestions = await getSuggestions(path);

  return (
    <Suggestions suggestions={suggestions}>
      <NoSuggestions />
      <TopSuggestion />
    </Suggestions>
  );
}
