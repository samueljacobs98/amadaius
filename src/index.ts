import { ZodTypeAny } from "zod";
import { PromptTemplateOptions } from "./types";
import { PromptTemplate } from "./templates/prompt-template";

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
 * const template = promptTemplate(schema, "Hello, {{name}}! You are {{age}} years old.");
 *
 * const rendered = template.build({ name: "Alice", age: 30 });
 * console.log(rendered); // Hello, Alice! You are 30 years old.
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
 * const template = promptTemplate(schema, "Hello, {{name}}! You are {{age}} years old.");
 *
 * const rendered = template
 *  .partial({ name: "Alice" })
 *  .partial({ age: 30 })
 *  .build();
 *
 * console.log(rendered); // Hello, Alice! You are 30 years old.
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
 * const result = promptTemplate(
 *    z.object({ greeting: pt1.asSchema(), question: pt2.asSchema() }),
 *    "{{greeting}} {{question}}",
 * ).build({ greeting: "Alice", question: "What is your favorite color?" });
 *
 *
 * console.log(result); // Hello, Alice! How are you, What is your favorite color?
 * ```
 */
export function promptTemplate<TSchema extends ZodTypeAny>(
  schema: TSchema,
  templateStr: string,
  options?: PromptTemplateOptions,
): PromptTemplate<TSchema> {
  return new PromptTemplate(schema, templateStr, options);
}
