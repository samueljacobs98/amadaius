import { z, ZodTypeAny } from "zod";
import { DeepPartial, PromptTemplateOptions } from "../types";
import { merge } from "lodash";
import Handlebars from "handlebars";

/**
 * Represents a template that can be built with partial data validated against a Zod schema.
 */
export class PartialPromptTemplate<TSchema extends ZodTypeAny> {
  private hb = Handlebars.create();
  private compiledTemplate = this.hb.compile(this.templateStr.trim());
  private partialData: DeepPartial<z.input<TSchema>> = {};

  /**
   * Constructs a new PartialPromptTemplate.
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
   * @returns The rendered template string.
   */
  build(): string {
    const result = this.schema.parse(this.partialData);
    return this.compiledTemplate(result);
  }

  /**
   * Asynchronously builds the final template string by validating and processing the input data.
   *
   * @returns A promise that resolves to the rendered template string.
   */
  async buildAsync(): Promise<string> {
    const result = await this.schema.parseAsync(this.partialData);
    return this.compiledTemplate(result);
  }

  /**
   * Adds partial data to the template.
   *
   * @param data - The partial data to add.
   * @returns This instance for chaining.
   */
  partial(data: DeepPartial<z.input<TSchema>>): this {
    this.partialData = merge(this.partialData, data);
    return this;
  }

  /**
   * Creates a copy of the PartialPromptTemplate instance.
   *
   * @returns A new PartialPromptTemplate instance.
   */
  copy(): PartialPromptTemplate<TSchema> {
    return new PartialPromptTemplate(
      this.schema,
      this.templateStr,
      this.options,
    ).partial(this.partialData);
  }
}
