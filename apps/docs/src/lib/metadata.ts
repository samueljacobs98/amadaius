import type { Metadata } from "next/types";

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      //   url: 'http',
      images: "/banner.png",
      siteName: "Amadaius Docs",
      ...override.openGraph,
    },
  };
}
