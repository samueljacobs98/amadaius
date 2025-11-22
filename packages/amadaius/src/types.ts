import type { HelperDelegate } from "handlebars";
import type { PromptTemplate } from "./templates/prompt-template";
import type { z, ZodTypeAny } from "zod";

/**
 * Converts a type to a type where all properties are optional.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Metadata associated with a PromptTemplate.
 */
export type PromptMetadata<TSchema extends ZodTypeAny> = {
  templateId?: string;
  experimentId?: string;
  version?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  custom?: Record<string, any>;
  type: "partial" | "full";
  templateStr: string;
  data: z.output<TSchema>;
};

/**
 *  Configuration options for a PromptTemplate instance.
 */
export type PromptTemplateOptions<TSchema extends ZodTypeAny> = {
  metadata: Omit<PromptMetadata<TSchema>, "templateStr" | "data">;
  helpers?: Record<string, HelperDelegate>;
};

/**
 * Extracts the `TSchema` generic parameter from a `PromptTemplate<TSchema>`
 */
type PromptTemplateSchema<T extends PromptTemplate<ZodTypeAny>> =
  T extends PromptTemplate<infer TSchema> ? TSchema : never;

/**
 * Utility type that infers the *input* type of a PromptTemplate.
 * Essentially the same as `z.input<TSchema>`.
 */
export type PromptTemplateDataInput<T extends PromptTemplate<ZodTypeAny>> =
  z.input<PromptTemplateSchema<T>>;

/**
 * Utility type that infers the *output* type of a PromptTemplate.
 * Essentially the same as `z.output<TSchema>`.
 */
export type PromptTemplateDataOutput<T extends PromptTemplate<ZodTypeAny>> =
  z.output<PromptTemplateSchema<T>>;

/**
 * The result of a PromptTemplate build operation.
 */
export type PromptTemplateBuildResult<TSchema extends ZodTypeAny> = {
  prompt: string;
  metadata: PromptMetadata<TSchema>;
};

/**
 * The result of a PromptTemplate build operation, returned asynchronously.
 */
export type PromptTemplateBuildResultAsync<TSchema extends ZodTypeAny> =
  Promise<PromptTemplateBuildResult<TSchema>>;
