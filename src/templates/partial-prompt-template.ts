import { z, ZodTypeAny } from "zod";
import { DeepPartial, PromptTemplateOptions } from "../types";
import { merge } from "lodash";
import Handlebars from "handlebars";

export class PartialPromptTemplate<TSchema extends ZodTypeAny> {
  private hb = Handlebars.create();
  private compiledTemplate = this.hb.compile(this.templateStr.trim());
  private partialData: DeepPartial<z.input<TSchema>> = {};

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

  build(): string {
    const result = this.schema.parse(this.partialData);
    return this.compiledTemplate(result);
  }

  async buildAsync(): Promise<string> {
    const result = await this.schema.parseAsync(this.partialData);
    return this.compiledTemplate(result);
  }

  partial(data: DeepPartial<z.input<TSchema>>): this {
    this.partialData = merge(this.partialData, data);
    return this;
  }

  copy(): PartialPromptTemplate<TSchema> {
    return new PartialPromptTemplate(
      this.schema,
      this.templateStr,
      this.options,
    ).partial(this.partialData);
  }
}
