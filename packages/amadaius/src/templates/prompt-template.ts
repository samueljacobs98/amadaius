import type { z, ZodTypeAny } from "zod";
import Handlebars from "handlebars";
import type {
  PromptTemplateBuildResult,
  PromptTemplateBuildResultAsync,
  PromptTemplateOptions,
} from "../types";
import { PartialPromptTemplate } from "./partial-prompt-template";

/**
 * Represents a template that can be built with data validated against a Zod schema.
 * Supports composition by allowing nested PromptTemplate instances within the schema.
 */
export class PromptTemplate<TSchema extends ZodTypeAny> {
  private hb = Handlebars.create();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private compiledTemplate: HandlebarsTemplateDelegate<any>;

  /**
   * Constructs a new PromptTemplate.
   *
   * @param schema - The Zod schema for validating input data.
   * @param templateStr - The Handlebars template string.
   * @param options - Optional configuration, including helpers and metadata.
   */
  constructor(
    private schema: TSchema,
    private templateStr: string,
    private options: PromptTemplateOptions<TSchema>,
  ) {
    this.compiledTemplate = this.hb.compile(this.templateStr.trim());
    if (this.options.helpers) {
      Object.entries(this.options.helpers).forEach(([name, helper]) => {
        this.hb.registerHelper(name, helper);
      });
    }
  }

  /**
   * Builds the final template string by validating and processing the input data.
   *
   * @param data - The input data adhering to the schema.
   * @returns An object containing the rendered template string and metadata.
   */
  build(data: z.input<TSchema>): PromptTemplateBuildResult<TSchema> {
    const result = this.schema.parse(data);
    const prompt = this.compiledTemplate(result);
    return {
      prompt,
      metadata: {
        ...this.options.metadata,
        templateStr: this.templateStr,
        data: result,
      },
    };
  }

  /**
   * Asynchronously builds the final template string by validating and processing the input data.
   *
   * @param data - The input data adhering to the schema.
   * @returns A promise that resolves to an object containing the rendered template string and metadata.
   */
  async buildAsync(
    data: z.input<TSchema>,
  ): PromptTemplateBuildResultAsync<TSchema> {
    const result = await this.schema.parseAsync(data);
    const prompt = this.compiledTemplate(result);
    return {
      prompt,
      metadata: {
        ...this.options.metadata,
        templateStr: this.templateStr,
        data: result,
      },
    };
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
