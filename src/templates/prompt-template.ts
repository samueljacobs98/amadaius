import { z, ZodTypeAny } from "zod";
import Handlebars from "handlebars";
import { PromptTemplateOptions } from "../types";
import { PartialPromptTemplate } from "./partial-prompt-template";

export class PromptTemplate<TSchema extends ZodTypeAny> {
  private hb = Handlebars.create();
  private compiledTemplate = this.hb.compile(this.templateStr.trim());

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

  build(data: z.input<TSchema>): string {
    const result = this.schema.parse(data);
    return this.compiledTemplate(result);
  }

  async buildAsync(data: z.input<TSchema>): Promise<string> {
    const result = await this.schema.parseAsync(data);
    return this.compiledTemplate(result);
  }

  asPartial() {
    return new PartialPromptTemplate(
      this.schema,
      this.templateStr,
      this.options,
    );
  }

  asSchema(): ZodTypeAny {
    return this.schema.transform((data) => this.compiledTemplate(data));
  }
}
