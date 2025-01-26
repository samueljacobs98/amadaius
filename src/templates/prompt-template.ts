import { z, ZodTypeAny } from "zod";
import Handlebars from "handlebars";
import { PromptTemplateOptions } from "../types";
import { PartialPromptTemplate } from "./partial-prompt-template";

/**
 * Represents a template that can be built with data validated against a Zod schema.
 * Supports composition by allowing nested PromptTemplate instances within the schema.
 */
export class PromptTemplate<TSchema extends ZodTypeAny> {
  private hb = Handlebars.create();
  private compiledTemplate = this.hb.compile(this.templateStr.trim());

  /**
   * Constructs a new PromptTemplate.
   *
   * @param schema - The Zod schema for validating input data.
   * @param templateStr - The Handlebars template string.
   * @param options - Optional configuration, including helpers.
   */
  constructor(
    private schema: TSchema,
    private templateStr: string,
    private options?: PromptTemplateOptions,
  ) {
    if (this.options?.helpers) {
      Object.entries(this.options.helpers).forEach(([name, helper]) => {
        this.hb.registerHelper(name, helper);
      });
    }
  }

  /**
   * Builds the final template string by validating and processing the input data.
   *
   * @param data - The input data adhering to the schema.
   * @returns The rendered template string.
   */
  build(data: z.input<TSchema>): string {
    const result = this.schema.parse(data);
    return this.compiledTemplate(result);
  }

  /**
   * Asynchronously builds the final template string by validating and processing the input data.
   *
   * @param data - The input data adhering to the schema.
   * @returns A promise that resolves to the rendered template string.
   */
  async buildAsync(data: z.input<TSchema>): Promise<string> {
    const result = await this.schema.parseAsync(data);
    return this.compiledTemplate(result);
  }

  /**
   * Converts the PromptTemplate into a PartialPromptTemplate.
   *
   * @returns A new PartialPromptTemplate instance.
   */
  asPartial() {
    return new PartialPromptTemplate(
      this.schema,
      this.templateStr,
      this.options,
    );
  }

  /**
   * Converts the PromptTemplate into a Zod schema.
   *
   * @returns The Zod schema.
   */
  asSchema(): ZodTypeAny {
    return this.schema.transform((data) => this.compiledTemplate(data));
  }
}
