import { z } from "zod";
import { expectNotType, expectType } from "tsd";

import { promptTemplate } from "../../src/index";
import {
  PromptTemplateDataInput,
  PromptTemplateDataOutput,
} from "../../src/types";

const myTemplate = promptTemplate(
  z.object({
    name: z.string(),
    age: z.number(),
  }),
  "Hello {{name}}, you are {{age}} years old!",
);

type MyTemplateInput = PromptTemplateDataInput<typeof myTemplate>;
expectType<{ name: string; age: number }>(null as unknown as MyTemplateInput);

type MyTemplateOutput = PromptTemplateDataOutput<typeof myTemplate>;
expectType<{ name: string; age: number }>(null as unknown as MyTemplateOutput);

expectNotType<{ name: string }>(null as unknown as MyTemplateInput);
