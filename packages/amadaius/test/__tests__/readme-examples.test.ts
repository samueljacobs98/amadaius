import { promptTemplate } from "../../src";
import { z } from "zod";

describe("README Examples", () => {
  describe("Basic Usage Examples", () => {
    test("Creating a Prompt Template", () => {
      const pt = promptTemplate(
        z.object({ topic: z.string() }),
        "Write a story about {{topic}}!",
      );

      const { prompt, metadata } = pt.build({ topic: "dragons" });

      expect(prompt).toBe("Write a story about dragons!");
      expect(metadata).toMatchObject({
        type: "full",
        templateStr: "Write a story about {{topic}}!",
        data: { topic: "dragons" },
      });
    });

    test("Validating and Transforming Data - Refinements", () => {
      const pt = promptTemplate(
        z
          .object({
            id: z.string(),
            name: z.string(),
          })
          .refine((data) => data.id.length === 10, {
            message: "User ID must be exactly 10 characters long",
          }),
        "Hello, {{name}}! Your ID is {{id}}.",
      );

      const { prompt } = pt.build({ id: "0123456789", name: "Alice" });
      expect(prompt).toBe("Hello, Alice! Your ID is 0123456789.");

      expect(() => pt.build({ id: "short", name: "Invalid" })).toThrow();
    });

    test("Validating and Transforming Data - Transformations", () => {
      const pt = promptTemplate(
        z.string().transform((topic) => ({ topic })),
        "Write a story about {{topic}}!",
      );

      const { prompt } = pt.build("dinosaurs");
      expect(prompt).toBe("Write a story about dinosaurs!");
    });

    test("Composing Prompt Templates", () => {
      const pt1 = promptTemplate(
        z.object({ name: z.string() }),
        "Hello, {{name}}!",
      );
      const pt2 = promptTemplate(
        z.object({ question: z.string() }),
        "{{question}}",
      );

      const { prompt } = promptTemplate(
        z.object({ greeting: pt1.asSchema(), request: pt2.asSchema() }),
        "{{greeting}} {{request}}",
      ).build({
        greeting: { name: "Alice" },
        request: { question: "What is your favorite color?" },
      });

      expect(prompt).toBe("Hello, Alice! What is your favorite color?");
    });

    test("Partial Templates", () => {
      const pt = promptTemplate(
        z.object({
          persona: z.string(),
          message: z.string(),
        }),
        "You are {{persona}}. Respond to: {{message}}",
      );

      const partialPt = pt.asPartial();

      partialPt.partial({ persona: "a knowledgeable AI librarian" });
      partialPt.partial({
        message: "What are the best science fiction books?",
      });

      const { prompt } = partialPt.build();

      expect(prompt).toBe(
        "You are a knowledgeable AI librarian. Respond to: What are the best science fiction books?",
      );

      const partialPtCopy = partialPt.copy();
      const { prompt: copyPrompt } = partialPtCopy.build();
      expect(copyPrompt).toBe(prompt);
    });

    test("Custom Handlebars Helpers", () => {
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

      const { prompt } = pt.build({
        persona: "A knowledgeable librarian",
        user_message: "could you help me find a good science fiction book?",
        tone: "enthusiastic",
      });

      const expectedOutput = `
        You are a helpful AI assistant who always follows the persona and tone specified below.
        Persona: A knowledgeable librarian
        
        User said: "Wow, check this out: could you help me find a good science fiction book?!!!"
        
        Please respond to the user's message in a manner consistent with the persona and tone above.
        `;

      expect(prompt.replace(/\s+/g, " ").trim()).toBe(
        expectedOutput.replace(/\s+/g, " ").trim(),
      );
    });

    test("Async Data Transformations", async () => {
      const asyncPt = promptTemplate(
        z
          .object({
            productNumber: z.number(),
          })
          .transform(async ({ productNumber }) => {
            // Simulating async product data fetch
            return {
              productNumber,
              productData: `
{
  "name": "Test Product",
  "price": 99.99,
  "description": "A test product"
}
              `.trim(),
            };
          }),
        "Act as an expert in creating product descriptions.\n\nProduct {{productNumber}}:\n\n{{{productData}}}\n\nCreate a product description based on the data provided.",
      );

      const { prompt } = await asyncPt.buildAsync({ productNumber: 1234 });

      const expectedOutput = `Act as an expert in creating product descriptions.

Product 1234:

{
  "name": "Test Product",
  "price": 99.99,
  "description": "A test product"
}

Create a product description based on the data provided.`;

      expect(prompt.trim()).toBe(expectedOutput.trim());
    });
  });
});
