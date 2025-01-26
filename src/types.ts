import { HelperDelegate } from "handlebars";
import { PromptTemplate } from "./templates/prompt-template";
import { z, ZodTypeAny } from "zod";

/**
 * Converts a type to a type where all properties are optional.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 *  Configuration options for a PromptTemplate instance.
 */
export type PromptTemplateOptions = {
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
export type PromptTemplateInput<T extends PromptTemplate<ZodTypeAny>> = z.input<
  PromptTemplateSchema<T>
>;

/**
 * Utility type that infers the *output* type of a PromptTemplate.
 * Essentially the same as `z.output<TSchema>`.
 */
export type PromptTemplateOutput<T extends PromptTemplate<ZodTypeAny>> =
  z.output<PromptTemplateSchema<T>>;
