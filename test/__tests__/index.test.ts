import { promptTemplate } from "../../src";
import { z } from "zod";
import { PartialPromptTemplate } from "../../src/templates/partial-prompt-template";

describe("Amadaius Library Tests", () => {
  describe("Prompt Templates", () => {
    test("Basic template rendering with simple variables", () => {
      const pt = promptTemplate(
        z.object({ topic: z.string() }),
        "Write a story about {{topic}}!",
      );

      const result = pt.build({ topic: "dragons" }).prompt;

      expect(result).toBe("Write a story about dragons!");
    });

    test("Comments ignored in template rendering", () => {
      const pt = promptTemplate(
        z.object({ topic: z.string() }),
        "{{!-- This is a comment --}}Write a story about {{topic}}!{{!-- This is a comment --}}",
      );

      const result = pt.build({ topic: "dragons" }).prompt;

      expect(result).toBe("Write a story about dragons!");
    });

    test("Template rendering with built-in helper", () => {
      const pt = promptTemplate(
        z.object({
          topic: z.string(),
          and: z.string().optional(),
        }),
        `Write a story about {{topic}}{{#if and}} and {{and}}{{/if}}!`,
      );

      const result = pt.build({ topic: "dragons" }).prompt;
      expect(result).toBe("Write a story about dragons!");

      const resultWith = pt.build({ topic: "dragons", and: "knights" }).prompt;
      expect(resultWith).toBe("Write a story about dragons and knights!");
    });

    test("Template rendering with custom helper", () => {
      const pt = promptTemplate(
        z.object({
          persona: z.string(),
          user_message: z.string(),
          tone: z.enum(["formal", "casual", "enthusiastic"]),
        }),
        `
          You are a helpful AI assistant who always follows the persona and tone specified below.
          Persona: {{persona}}
          
          User said: "{{transformTone user_message tone}}"
          
          Please respond to the user's message in a manner consistent with the persona and tone above.
        `,
        {
          helpers: {
            transformTone: (
              message: string,
              tone: "formal" | "casual" | "enthusiastic",
            ) => {
              switch (tone) {
                case "formal":
                  return `Good day. I would like to bring to your attention: ${
                    message.charAt(0).toUpperCase() + message.slice(1)
                  }.`;
                case "casual":
                  return `Hey! So basically: ${message}`;
                case "enthusiastic":
                  return `Wow, check this out: ${message}!!!`;
                default:
                  return message;
              }
            },
          },
        },
      );

      const result = pt.build({
        persona: "A knowledgeable librarian",
        user_message: "could you help me find a good science fiction book?",
        tone: "enthusiastic",
      }).prompt;

      const expectedOutput = `You are a helpful AI assistant who always follows the persona and tone specified below.
    Persona: A knowledgeable librarian
    
    User said: "Wow, check this out: could you help me find a good science fiction book?!!!"
    
    Please respond to the user's message in a manner consistent with the persona and tone above.`;

      expect(result.replace(/\s+/g, " ").trim()).toBe(
        expectedOutput.replace(/\s+/g, " ").trim(),
      );
    });

    test("Multiple prompts built with the same template", () => {
      const pt = promptTemplate(
        z.object({ topic: z.string() }),
        "Write a story about {{topic}}!",
      );

      const result1 = pt.build({ topic: "dragons" }).prompt;
      const result2 = pt.build({ topic: "knights" }).prompt;

      expect(result1).toBe("Write a story about dragons!");
      expect(result2).toBe("Write a story about knights!");
    });

    test("Template rendering with enums", () => {
      const pt = promptTemplate(
        z.object({
          topic: z.enum(["dragons", "knights", "wizards"]),
        }),
        "Write a story about {{topic}}!",
      );

      const result = pt.build({ topic: "knights" }).prompt;

      expect(result).toBe("Write a story about knights!");
    });

    test("Template rendering with optional fields and default values", () => {
      const pt = promptTemplate(
        z.object({
          name: z.string().default("Guest"),
          age: z.number().optional(),
        }),
        `You are speaking to {{name}}!
{{#if age}}{{name}}'s age is {{age}}.{{/if}}`,
      );

      const resultWithValues = pt.build({ name: "Alice", age: 30 }).prompt;
      const resultWithoutValues = pt.build({}).prompt.trim();

      expect(resultWithValues).toBe(
        "You are speaking to Alice!\nAlice's age is 30.",
      );
      expect(resultWithoutValues).toBe("You are speaking to Guest!");
    });

    test("Template rendering with complex data types (arrays and nested objects)", () => {
      const pt = promptTemplate(
        z.object({
          tweets: z.array(
            z.object({
              tweet: z.string(),
              sentiment: z.enum(["positive", "negative"]),
            }),
          ),
          tweet: z.string(),
        }),
        `
  Twitter is a social media platform where users can post short messages called "tweets". Tweets can be positive or negative, and we would like to be able to classify tweets as positive or negative. Here are some examples of positive and negative tweets. Make sure to classify the last tweet correctly.
  {{#each tweets}}
  Q: Tweet: "{{this.tweet}}" Is this tweet positive or negative?
  A: {{this.sentiment}}
  {{/each}}
  Q: Tweet: "{{tweet}}" Is this tweet positive or negative?
  A: `,
      );

      const data = {
        tweets: [
          { tweet: "What a beautiful day!", sentiment: "positive" as const },
          { tweet: "I hate this class", sentiment: "negative" as const },
        ],
        tweet: "I love pockets on jeans",
      };

      const expectedOutput = `
  Twitter is a social media platform where users can post short messages called "tweets". Tweets can be positive or negative, and we would like to be able to classify tweets as positive or negative. Here are some examples of positive and negative tweets. Make sure to classify the last tweet correctly.
  Q: Tweet: "What a beautiful day!" Is this tweet positive or negative?
  A: positive
  Q: Tweet: "I hate this class" Is this tweet positive or negative?
  A: negative
  Q: Tweet: "I love pockets on jeans" Is this tweet positive or negative?
  A:
  `;

      const result = pt.build(data).prompt;
      expect(result.trim()).toBe(expectedOutput.trim());
    });

    test("Template rendering with refined schema", () => {
      const pt = promptTemplate(
        z
          .object({
            id: z.string(),
            name: z.string(),
          })
          .refine((data) => data.id.length === 10),
        `Use the greet_user tool to greet the following user with name: {{name}} and ID: {{id}}`,
      );

      const validData = { id: "0123456789", name: "Valid User" };
      const invalidData = { id: "too short", name: "Invalid User" };

      const result = pt.build(validData).prompt;

      expect(result).toBe(
        `Use the greet_user tool to greet the following user with name: ${validData.name} and ID: ${validData.id}`,
      );

      const createResult = () => pt.build(invalidData);
      expect(createResult).toThrow();
    });

    test("Template rendering with transformed schema", () => {
      const pt = promptTemplate(
        z.string().transform((topic) => ({ topic })),
        "Write a story about {{topic}}!",
      );

      const result = pt.build("dragons").prompt;

      expect(result).toBe("Write a story about dragons!");
    });

    test("Template rendering with asynchronous transformed schema", async () => {
      const pt = promptTemplate(
        z.object({
          userId: z.string(),
        }),
        "User ID: {{userId}}",
      );

      const result = (await pt.buildAsync({ userId: "async123" })).prompt;

      expect(result).toBe("User ID: async123");
    });

    test("Error handling when validation fails", () => {
      const pt = promptTemplate(
        z.object({ name: z.string() }),
        "Hello, {{name}}!",
      );

      // @ts-expect-error Type 'number' is not assignable to type 'string'.ts(2322)
      expect(() => pt.build({ name: 123 })).toThrowErrorMatchingSnapshot();
    });

    test("Error handling with custom error messages", () => {
      const error = "Name must be at least 5 characters";

      const pt = promptTemplate(
        z.object({ name: z.string().min(5, error) }),
        "Hello, {{name}}!",
      );

      expect(() => pt.build({ name: "John" })).toThrow(error);
    });

    test("Compose templates", () => {
      const pt1 = promptTemplate(z.string(), "Hello, {{this}}!");
      const pt2 = promptTemplate(z.string(), "How are you, {{this}}");

      const composedPt = promptTemplate(
        z.object({ greeting: pt1.asSchema(), question: pt2.asSchema() }),
        "{{greeting}} {{question}}",
      );

      const result = composedPt.build({
        greeting: "Alice",
        question: "What is your favorite color?",
      }).prompt;

      expect(result).toBe(
        "Hello, Alice! How are you, What is your favorite color?",
      );
    });

    test("Compose complex templates", () => {
      const pt1 = promptTemplate(
        z.object({ name: z.string() }),
        "Hello, {{name}}!",
      );
      const pt2 = promptTemplate(
        z.object({ question: z.string() }),
        "How are you, {{question}}",
      );

      const composedPt = promptTemplate(
        z.object({ greeting: pt1.asSchema(), request: pt2.asSchema() }),
        "{{greeting}} {{request}}",
      );

      const result = composedPt.build({
        greeting: { name: "Alice" },
        request: { question: "What is your favorite color?" },
      }).prompt;

      expect(result).toBe(
        "Hello, Alice! How are you, What is your favorite color?",
      );
    });

    test("Built templates return metadata", () => {
      const metadata = {
        templateId: "story-template",
        experimentId: "experiment-123",
        version: "1.0",
        description: "A template for writing stories",
        custom: {
          key: "value",
        },
      };

      const pt = promptTemplate(
        z.object({ topic: z.string() }),
        "Write a story about {{topic}}!",
        { metadata },
      );

      const { metadata: result } = pt.build({ topic: "dragons" });

      const expectedOutput = {
        ...metadata,
        templateStr: "Write a story about {{topic}}!",
        data: { topic: "dragons" },
        type: "full",
      };

      expect(result).toMatchObject(expectedOutput);
    });
  });

  describe("Partial Prompt Templates", () => {
    test("Create a partial prompt template from prompte template with object schema", () => {
      const pt = promptTemplate(
        z.object({ persona: z.string(), message: z.string() }),
        `You are {{persona}}. Respond: {{message}}`,
      );

      const partialPt = pt.asPartial();

      expect(partialPt).toBeInstanceOf(PartialPromptTemplate);
    });

    test("Create a partial prompt template from prompt template with string schema", () => {
      const pt = promptTemplate(z.string(), `You are {{this}}`);

      const partialPt = pt.asPartial();

      expect(partialPt).toBeInstanceOf(PartialPromptTemplate);
    });

    test("Chained partial application", () => {
      const pt = promptTemplate(
        z
          .object({ persona: z.string(), message: z.string() })
          .transform(({ persona, message }) => ({
            persona,
            message,
            prompt: `You are ${persona}. Respond: ${message}`,
          })),
        "{{prompt}}",
      );

      const partialPt = pt
        .asPartial()
        .partial({ persona: "a knowledgeable AI librarian" })
        .partial({ message: "What are the best science fiction books?" });

      const result = partialPt.build().prompt;

      const expectedOutput = `You are a knowledgeable AI librarian. Respond: What are the best science fiction books?`;

      expect(result).toBe(expectedOutput);
    });

    test("Unchained partial application", () => {
      const pt = promptTemplate(
        z
          .object({ persona: z.string(), message: z.string() })
          .transform(({ persona, message }) => ({
            persona,
            message,
            prompt: `You are ${persona}. Respond: ${message}`,
          })),
        "{{prompt}}",
      );

      const partialPt = pt.asPartial();

      partialPt.partial({ persona: "a knowledgeable AI librarian" });
      partialPt.partial({
        message: "What are the best science fiction books?",
      });

      const result = partialPt.build().prompt;

      const expectedOutput = `You are a knowledgeable AI librarian. Respond: What are the best science fiction books?`;

      expect(result).toBe(expectedOutput);
    });

    test("Partial template rendering with custom helper", () => {
      const partialPt = promptTemplate(
        z.object({
          persona: z.string(),
          user_message: z.string(),
          tone: z.enum(["formal", "casual", "enthusiastic"]),
        }),
        `
          You are a helpful AI assistant who always follows the persona and tone specified below.
          Persona: {{persona}}
  
          User said: "{{transformTone user_message tone}}"
  
          Please respond to the user's message in a manner consistent with the persona and tone above.
        `,
        {
          helpers: {
            transformTone: (
              message: string,
              tone: "formal" | "casual" | "enthusiastic",
            ) => {
              switch (tone) {
                case "formal":
                  return `Good day. I would like to bring to your attention: ${
                    message.charAt(0).toUpperCase() + message.slice(1)
                  }.`;
                case "casual":
                  return `Hey! So basically: ${message}`;
                case "enthusiastic":
                  return `Wow, check this out: ${message}!!!`;
                default:
                  return message;
              }
            },
          },
        },
      ).asPartial();

      partialPt.partial({
        persona: "A knowledgeable librarian",
      });

      partialPt.partial({
        user_message: "could you help me find a good science fiction book?",
        tone: "enthusiastic",
      });

      const result = partialPt.build().prompt;

      const expectedOutput = `You are a helpful AI assistant who always follows the persona and tone specified below.
      Persona: A knowledgeable librarian
  
      User said: "Wow, check this out: could you help me find a good science fiction book?!!!"
  
      Please respond to the user's message in a manner consistent with the persona and tone above.`;

      expect(result.replace(/\s+/g, " ").trim()).toBe(
        expectedOutput.replace(/\s+/g, " ").trim(),
      );
    });

    test("Copy a partial prompt template", () => {
      const partialPt = promptTemplate(
        z
          .object({ persona: z.string(), message: z.string() })
          .transform(({ persona, message }) => ({
            persona,
            message,
            prompt: `You are ${persona}. Respond: ${message}`,
          })),
        "{{prompt}}",
      ).asPartial();

      const partialPtCopy = partialPt.copy();

      expect(partialPtCopy).toBeInstanceOf(PartialPromptTemplate);
    });

    test("Copying a partial prompt template preserves partial data", () => {
      const partialPt1 = promptTemplate(
        z
          .object({ persona: z.string(), message: z.string() })
          .transform(({ persona, message }) => ({
            persona,
            message,
            prompt: `You are ${persona}. Respond: ${message}`,
          })),
        "{{prompt}}",
      ).asPartial();

      partialPt1.partial({ persona: "an expert AI assistant" });

      const partialPt2 = partialPt1.copy();

      partialPt1.partial({
        message: "What are the best books?",
      });
      partialPt2.partial({
        message: "What are the best movies?",
      });

      const result1 = partialPt1.build().prompt;
      const result2 = partialPt2.build().prompt;

      const expectedOutput1 =
        "You are an expert AI assistant. Respond: What are the best books?";
      const expectedOutput2 =
        "You are an expert AI assistant. Respond: What are the best movies?";

      expect(result1).toBe(expectedOutput1);
      expect(result2).toBe(expectedOutput2);
    });

    test("Partial application with nested data", () => {
      const partialPt = promptTemplate(
        z.object({
          persona: z.object({
            id: z.string(),
            name: z.string(),
          }),
          question: z.string(),
        }),
        `
        Hello {{persona.name}}, as a world-renowned AI expert, could you please provide insight on the following?
        Question: {{question}}
    `,
      ).asPartial();

      partialPt.partial({
        persona: { name: "Alice" },
      });

      partialPt.partial({
        persona: { id: "123" },
        question: "What breakthroughs have happened in AI recently?",
      });

      const result = partialPt.build().prompt;

      const expectedOutput = `
        Hello Alice, as a world-renowned AI expert, could you please provide insight on the following?
        Question: What breakthroughs have happened in AI recently?
      `;

      expect(result.trim()).toBe(expectedOutput.trim());
    });

    test("Asynchronous transformations with partial application", async () => {
      const partialPt = promptTemplate(
        z
          .object({
            userId: z.string(),
          })
          .transform(async ({ userId }) => {
            const userData = await Promise.resolve({
              name: "Async User",
              id: userId,
            });
            return { user: userData };
          }),
        "User: {{user.name}} (ID: {{user.id}})",
      )
        .asPartial()
        .partial({ userId: "async123" });

      const result = (await partialPt.buildAsync()).prompt;

      expect(result).toBe("User: Async User (ID: async123)");
    });

    test("Error handling when partial data does not meet schema requirements", () => {
      const partialPt = promptTemplate(
        z.object({
          persona: z.object({
            id: z.string(),
            name: z.string(),
          }),
          question: z.string(),
        }),
        `
    Hello {{persona.name}}, as a world-renowned AI expert, could you please provide insight on the following?
    Question: {{question}}
    `,
      ).asPartial();

      // @ts-expect-error Type 'number' is not assignable to type 'string'.
      partialPt.partial({ persona: { id: 123 } });

      const createResult = () => partialPt.build();

      expect(createResult).toThrowErrorMatchingSnapshot();
    });

    test("Error handling when asynchronous transformation fails", async () => {
      const partialPt = promptTemplate(
        z
          .object({
            userId: z.string(),
          })
          .transform(async () => {
            throw new Error("Failed to fetch user data");
          }),
        "User: {{user.name}} (ID: {{user.id}})",
      )
        .asPartial()
        .partial({ userId: "async123" });

      const resultPromise = partialPt.buildAsync();
      await expect(resultPromise).rejects.toThrowErrorMatchingSnapshot();
    });

    test("Built partial templates return metadata", () => {
      const metadata = {
        templateId: "story-template",
        experimentId: "experiment-123",
        version: "1.0",
        description: "A template for writing stories",
        custom: {
          key: "value",
        },
        type: "partial",
      };

      const pt = promptTemplate(
        z.object({ topic: z.string() }),
        "Write a story about {{topic}}!",
        { metadata },
      ).asPartial();

      const { metadata: result } = pt.partial({ topic: "dragons" }).build();

      const expectedOutput = {
        ...metadata,
        templateStr: "Write a story about {{topic}}!",
        data: { topic: "dragons" },
        type: "partial",
      };

      expect(result).toMatchObject(expectedOutput);
    });
  });
});
