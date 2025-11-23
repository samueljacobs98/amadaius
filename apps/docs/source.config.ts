import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs: ReturnType<typeof defineDocs> = defineDocs({
  dir: "node_modules/@amadaius/docs/content",
  docs: {
    schema: frontmatterSchema.extend({
      date: z
        .union([z.string(), z.date()])
        .transform((val) => {
          if (val instanceof Date) {
            return val.toISOString().split("T")[0];
          }
          return val;
        })
        .optional(),
      status: z.string().optional(),
      adrNumber: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
