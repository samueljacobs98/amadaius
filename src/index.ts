import { ZodTypeAny } from "zod";
import { PromptTemplateOptions } from "./types";
import { PromptTemplate } from "./templates/prompt-template";

export function promptTemplate<TSchema extends ZodTypeAny>(
  schema: TSchema,
  templateStr: string,
  options?: PromptTemplateOptions,
): PromptTemplate<TSchema> {
  return new PromptTemplate(schema, templateStr, options);
}
