import { ZodTypeAny } from "zod";
import { PromptTemplateOptions } from "./types";
import { PromptTemplate } from "./templates/prompt-template";

export * from "./types";

/**
 * Creates a new PromptTemplate instance.
 *
 * @param schema - The Zod schema for validating input data.
 * @param templateStr - The Handlebars template string.
 * @param options - Optional configuration, including helpers.
 * @returns A new PromptTemplate instance.
 *
 * @example
 * ```ts
 * import { promptTemplate } from "amadaius";
 * import { z } from "zod";
 *
 * const schema = z.object({
 *  name: z.string(),
 * age: z.number(),
 * });
 *
 * const pt = promptTemplate(schema, "Hello, {{name}}! You are {{age}} years old.");
 *
 * const { prompt } = pt.build({ name: "Alice", age: 30 });
 * console.log(prompt); // Hello, Alice! You are 30 years old.
 * ```
 *
 * @example
 * ```ts
 * import { promptTemplate } from "amadaius";
 * import { z } from "zod";
 *
 * const schema = z.object({
 *  name: z.string(),
 *  age: z.number(),
 * });
 *
 * const pt = promptTemplate(schema, "Hello, {{name}}! You are {{age}} years old.");
 *
 * const { prompt, metadata } = pt
 *  .partial({ name: "Alice" })
 *  .partial({ age: 30 })
 *  .build();
 *
 * console.log(prompt); // Hello, Alice! You are 30 years old.
 * ```
 *
 * @example
 * ```ts
 * import { promptTemplate } from "amadaius";
 * import { z } from "zod";
 *
 * const pt1 = promptTemplate(z.string(), "Hello, {{this}}!");
 * const pt2 = promptTemplate(z.string(), "How are you, {{this}}");
 *
 * const { prompt, metadata } = promptTemplate(
 *    z.object({ greeting: pt1.asSchema(), question: pt2.asSchema() }),
 *    "{{greeting}} {{question}}",
 * ).build({ greeting: "Alice", question: "What is your favorite color?" });
 *
 *
 * console.log(prompt);
 * // Hello, Alice! How are you, What is your favorite color?
 *
 * console.log(metadata);
 
 * // {
 * //  templateId: undefined,
 * //  experimentId: undefined,
 * //  version: undefined,
 * //  description: undefined,
 * //  custom: {},
 * //  type: 'full',
 * //  templateStr: '{{greeting}} {{question}}',
 * //  data: {
 * //     greeting: 'Hello, Alice!',
 * //     question: 'How are you, What is your favorite color?'
 * //  }
 * // }
 * ```
 */
export function promptTemplate<TSchema extends ZodTypeAny>(
  schema: TSchema,
  templateStr: string,
  options: Omit<PromptTemplateOptions<TSchema>, "metadata"> & {
    metadata?: Omit<PromptTemplateOptions<TSchema>["metadata"], "type">;
  } = {},
): PromptTemplate<TSchema> {
  return new PromptTemplate(schema, templateStr, {
    ...options,
    metadata: { ...options.metadata, type: "full" },
  });
}
