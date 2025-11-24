import { Suspense } from "react";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsBody, DocsPage } from "fumadocs-ui/page";
import type { Metadata } from "next";
import {
  NotFoundCard,
  NotFoundCardHeader,
  NotFoundContainer,
  NotFoundContent,
  NotFoundLoader,
  NotFoundSubtitle,
  NotFoundTitle,
  SuggestionBlock,
} from "@/feature-groups/not-found";
import { createMetadata } from "@/lib/metadata";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    return (
      <NotFoundContainer>
        <NotFoundCard className="gap-y-8">
          <NotFoundCardHeader className="gap-y-2">
            <NotFoundTitle>Not Found</NotFoundTitle>
            <NotFoundSubtitle>
              The page you are looking for does not exist.
            </NotFoundSubtitle>
          </NotFoundCardHeader>
          <NotFoundContent>
            <Suspense fallback={<NotFoundLoader />}>
              <SuggestionBlock path={params.slug?.join("/") ?? ""} />
            </Suspense>
          </NotFoundContent>
        </NotFoundCard>
      </NotFoundContainer>
    );
  }

  // @ts-expect-error -- properties exist at runtime
  const MDX = page.data.body;

  return (
    // @ts-expect-error -- properties exist at runtime
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const { slug } = await props.params;

  if (!slug) {
    return createMetadata({ title: "Get Started" });
  }

  const page = source.getPage(slug);
  if (!page) return createMetadata({ title: "Not Found" });

  const description =
    page.data.description ?? "The library for building documentation sites";

  const image = {
    url: ["/og", ...slug, "image.webp"].join("/"),
    width: 1200,
    height: 630,
  };

  return createMetadata({
    title: page.data.title,
    description,
    openGraph: { url: `/docs/${page.slugs.join("/")}`, images: [image] },
    twitter: { images: [image] },
  });
}
