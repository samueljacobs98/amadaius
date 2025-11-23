import { Suspense } from "react";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { Metadata } from "next";
import { Badge } from "@frontend/ui/components";
import { cn } from "@frontend/ui/utils";
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

  const isAdr = page.slugs.includes("adr");
  // @ts-expect-error -- properties exist at runtime
  const date = page.data.date;
  // @ts-expect-error -- properties exist at runtime
  const status = page.data.status;
  // @ts-expect-error -- properties exist at runtime
  const adrNumber = page.data.adrNumber;

  if (isAdr) {
    return (
      // @ts-expect-error -- properties exist at runtime
      <DocsPage toc={page.data.toc} full={page.data.full}>
        <div className="space-y-2">
          <DocsTitle>
            {adrNumber && (
              <span
                className={cn(
                  "text-blue-400",
                  status === "Accepted" && "text-green-400",
                  status === "Proposed" && "text-yellow-400",
                  status === "Deprecated" && "text-red-400",
                  status === "Superseded" && "text-red-400",
                )}
              >
                #{String(adrNumber).padStart(4, "0")}
              </span>
            )}{" "}
            {page.data.title}
          </DocsTitle>
          <div className="flex flex-wrap items-center gap-2">
            {status === "Accepted" && (
              <Badge className="bg-green-400 text-white">Accepted</Badge>
            )}
            {status === "Proposed" && (
              <Badge className="bg-yellow-400 text-white">Proposed</Badge>
            )}
            {status === "Deprecated" && (
              <Badge variant="destructive" className="bg-red-400 text-white">
                Deprecated
              </Badge>
            )}
            {status === "Superseded" && (
              <Badge variant="destructive" className="bg-red-400 text-white">
                Superseded
              </Badge>
            )}
            {date && (
              <span className="text-muted-foreground text-sm">
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
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

  return (
    // @ts-expect-error -- properties exist at runtime
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>

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
