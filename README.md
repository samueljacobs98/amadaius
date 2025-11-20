# Amadaius

[![npm version](https://badge.fury.io/js/amadaius.svg)](https://badge.fury.io/js/amadaius)

[Amadaius](https://github.com/samueljacobs98/amadaius) is a TypeScript/JavaScript library designed to simplify and streamline the process of creating text-based prompts for AI applications. By separating **data validation and transformation** and **prompt structure**, Amadaius ensures your prompts are robust, reusable, and easy to manage.

Amadaius leverages:

- [Zod](https://github.com/colinhacks/zod) for data validation and transformations.
- [Handlebars](https://github.com/handlebars-lang/handlebars.js/) for templating.
- Optional custom helpers that can be easily plugged in.

## Why Use Amadaius?

1. **Separation of Concerns**: Keep your prompt content and structure independent, making it easier to update, localize, and reuse templates.
2. **Validation and Transformation**: Ensure your data is always in the correct format with Zod's powerful schema validation and enrichment features.
3. **Dynamic Templating**: Use Handlebars for conditional logic, loops, and custom helpers to create flexible and adaptable prompts.
4. **Modular Template Composition**: Build complex prompt templates seamlessly from smaller prompt templates.
5. **Incremental Application**: Build complex prompts step-by-step with partial templates, allowing you to fill in data incrementally.
6. **Async Support**: Handle asynchronous data fetching and transformations effortlessly.

> **TL;DR**  
> Amadaius enables you to create prompts that are validated, enriched, and dynamically generated with minimal effort. It's ideal for building AI applications that require structured and reusable prompts.

---

## Table of Contents

1. [Concepts](#concepts)
2. [Features](#features)
3. [Installation](#installation)
4. [Basic Usage](#basic-usage)
   - [Creating a Prompt Template](#creating-a-prompt-template)
   - [Validating and Transforming Data](#validating-and-transforming-data)
   - [Composing Prompt Templates](#composing-prompt-templates)
   - [Partial Templates](#partial-templates)
   - [Async Data Transformations](#async-data-transformations)
5. [API Reference](#api-reference)
   - [`promptTemplate(schema, templateStr, options?)`](#prompttemplateschema-templatestr-options)
   - [Class: `PromptTemplate<TSchema>`](#class-prompttemplatetschema)
     - [`build(data)`](#builddata)
     - [`buildAsync(data)`](#buildasyncdata)
     - [`asSchema()`](#asschema)
     - [`asPartial()`](#aspartial)
   - [Class: `PartialPromptTemplate<TSchema>`](#class-partialprompttemplatetschema)
     - [`partial(data)`](#partialdata)
     - [`build()`](#build)
     - [`buildAsync()`](#buildasync)
     - [`copy()`](#copy)
6. [Contributing](#contributing)
7. [License](#license)

---

## Concepts

### Prompt Structure and Content

- **Prompt Structure**: How the content of the prompt is laid out, defined using a Handlebars template string.
- **Prompt Content**: The validated and enriched data provided to the template to populate the structure.

### Validation and Enrichment with Zod

- **Validation**: Ensures the data adheres to the expected shape and constraints.
- **Enrichment**: Transforms or adds data using Zod's `transform` method.

### Handlebars Helpers

Custom functions injected into templates to add dynamic behavior.

### Separation of Concerns

Amadaius emphasizes keeping **content** (data) and **structure** (template) independent, enabling easier reuse and localization.

### Modular Template Composition

Use the `asSchema` method to compose smaller prompt templates into larger, more complex templates, promoting modularity and reusability.

---

## Features

- **Zod Validation**: Ensure your template data is correct.
- **Handlebars-based Templating**: Use Handlebars features like conditionals, loops, helpers, and comments.
- **Partial Prompt Templates**: Build complex prompts incrementally, adding or overriding data fields at each step.
- **Asynchronous Support**: Seamlessly handle asynchronous data transformations ([`buildAsync(data)`](#buildasyncdata)).
- **Modular Composition**: Combine smaller prompt templates into larger ones using [`asSchema()`](#asschema).

---

## Installation

```bash
# Using npm
npm install amadaius
```

---

## Basic Usage

### Creating a Prompt Template

1. **Define a schema** describing the data your prompt needs.
2. **Define a template string** (Handlebars syntax) that references properties in the schema.
3. Create a `PromptTemplate` using `promptTemplate(schema, templateStr, options)`.

```typescript
import { promptTemplate } from "amadaius";
import { z } from "zod";

// Template references `{{topic}}`
const pt = promptTemplate(
  z.object({ topic: z.string() }),
  "Write a story about {{topic}}!",
);

// Provide data matching the schema
const { prompt, metadata } = pt.build({ topic: "dragons" });

console.log(prompt);
// -> "Write a story about dragons!"

console.log(metadata);
// -> {
//      type: "full",
//      templateStr: "Write a story about {{topic}}!",
//      data: { topic: "dragons" }
//    }
```

### Validating and Transforming Data

Zod can do more than just type-check. You can refine, transform, and set default values. If data fails validation, an error is thrown.

```typescript
import { promptTemplate } from "amadaius";
import { z } from "zod";

// Example of refining schema
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

try {
  const { prompt } = pt.build({ id: "0123456789", name: "Alice" });
  console.log(prompt);
  // -> "Hello, Alice! Your ID is 0123456789."

pt.build({ id: "short", name: "Invalid" }); // This will throw a Zod validation error  
} catch (error) {
  console.error(error);
  // -> ZodError: User ID must be exactly 10 characters long
}
```

You can also transform data using Zod's `transform` method.

```typescript

const pt = promptTemplate(
   z.string().transform((topic) => ({ topic })), // transforms a string into { topic },
  "Write a story about {{topic}}!",
);

// We can pass just a string; the schema transforms it into { topic }
const { prompt } = pt.build("dinosaurs");

console.log(prompt);
// -> "Write a story about dinosaurs!"
```

### Composing Prompt Templates

You can convert a `PromptTemplate` into a Zod schema using `asSchema()`. This allows you to compose prompt templates together.

```typescript
import { promptTemplate } from "amadaius";
import { z } from "zod";

// Define smaller prompt templates
const pt1 = promptTemplate(
  z.object({ name: z.string() }),
  "Hello, {{name}}!",
);

const pt2 = promptTemplate(
  z.object({ question: z.string() }),
  "{{question}}",
);

// Compose them into a single prompt
const { prompt } = promptTemplate(
  z.object({ greeting: pt1.asSchema(), request: pt2.asSchema() }),
  "{{greeting}} {{request}}",
).build({
  greeting: { name: "Alice" },
  request: { question: "What is your favorite color?" },
});

console.log(prompt);
// -> "Hello, Alice! What is your favorite color?"
```

### Partial Templates

Sometimes you need to **partially apply** data to a template and fill in the rest later. You can convert a `PromptTemplate` into a `PartialPromptTemplate` using `asPartial()` and fill in data incrementally with `partial(data)`.

```typescript
import { promptTemplate } from "amadaius";
import { z } from "zod";

  const pt = promptTemplate(
    z.object({
      persona: z.string(),
      message: z.string(),
    }),
    "You are {{persona}}. Respond to: {{message}}",
  );

// Convert to partial template
      const partialPt = pt.asPartial();
// Fill data in multiple steps
partialPt.partial({ persona: "a knowledgeable AI librarian" });
partialPt.partial({
  message: "What are the best science fiction books?",
});

// When you're ready, build the final string
const { prompt } = partialPt.build();

console.log(prompt);
// -> "You are a knowledgeable AI librarian. Respond to: What are the best science fiction books?"
```

You can also **copy** a `PartialPromptTemplate` to create a new instance with the same data.

```typescript
const partialPtCopy = partialPt.copy();
const { prompt: copyPrompt } = partialPtCopy.build();
console.log(copyPrompt);
// -> "You are a knowledgeable AI librarian. Respond to: What are the best science fiction books?"
// partialPromptCopy shares the same partial data initially, then you can branch out
```

---

### Custom Handlebars Helpers

You can add custom Handlebars helpers to your templates by passing them in the `helpers` option.

```typescript
import { promptTemplate } from "amadaius";

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

console.log(prompt);
// -> `You are a helpful AI assistant who always follows the persona and tone specified below.
//     Persona: A knowledgeable librarian
//
//    User said: "Wow, check this out: could you help me find a good science fiction book?!!!"
//
//    Please respond to the user's message in a manner consistent with the persona and tone above.
// `
```

---

Amadaius supports asynchronous data transformations using `buildAsync(data)`.

```typescript
import { promptTemplate } from "amadaius";

const asyncPt = promptTemplate(
  z
    .object({
      productNumber: z.number(),
    })
    .transform(async ({ productNumber }) => {
      await getProductData(productNumber);
      return {
        productNumber,
        productData: JSON.stringify(productData, null, 2),
      };
    }),
  "Act as an expert in creating product descriptions.\n\nProduct {{productNumber}}:\n\n{{productData}}\n\nCreate a product description based on the data provided.",
);

const { prompt } = await asyncPt.buildAsync({ productNumber: 1234 });

console.log(prompt);
// -> "Act as an expert in creating product descriptions.\n\nProduct 1234:\n\n{ ... }\n\nCreate a product description based on the data provided."
```

---

## API Reference

### `promptTemplate(schema, templateStr, options?)`

Creates a new `PromptTemplate` instance.

**Signature**

```typescript
function promptTemplate<TSchema extends ZodType<any, any>>(
  schema: TSchema,
  templateStr: string,
  options?: PromptTemplateOptions,
): PromptTemplate<TSchema>;
```

**Parameters**

- `schema`: A Zod schema describing the shape of the data needed by your template.
- `templateStr`: A Handlebars template string.
- `options?`: Optional configuration:
  - `helpers?: Record<string, (...args: any) => any>`: A key-value map of custom Handlebars helpers.

**Returns**

- A new `PromptTemplate` instance.

---

### Class: `PromptTemplate<TSchema>`

A fully specified prompt template. You create an instance of this class using `promptTemplate`.

#### `build(data)`

Builds the prompt string using the provided data.

**Signature**

```typescript
build(data: z.input<TSchema>): PromptTemplateBuildResult<TSchema>;
```

**Parameters**

- `data`: Data matching the schema.

**Returns**

An object containing:

- `prompt`: The rendered template string
- `metadata`: Object containing:
  - `type`: "full" | "partial"
  - `templateStr`: Original template string
  - `data`: The validated/transformed data
  - Optional fields: `templateId`, `experimentId`, `version`, `description`, `custom`

**Throws**

- Zod validation errors if `data` doesn't match the schema.

#### `buildAsync(data)`

Builds the prompt string asynchronously using the provided data. This enables asynchronous data transformations (e.g., when using `z.transform(async ...)` in Zod).

**Signature**

```typescript
async buildAsync(data: z.input<TSchema>): Promise<PromptTemplateBuildResult<TSchema>>;
```

**Parameters**

- `data`: Data matching the schema.

**Returns**

A promise that resolves to an object containing:

- `prompt`: The rendered template string
- `metadata`: Object containing:
  - `type`: "full" | "partial"
  - `templateStr`: Original template string
  - `data`: The validated/transformed data
  - Optional fields: `templateId`, `experimentId`, `version`, `description`, `custom`

**Throws**

- Zod validation errors if `data` doesn't match the schema.

#### `asSchema()`

Enables prompt template composition by converting the `PromptTemplate` into a zod schema with a built-in `transform`.

**Signature**

```typescript
asSchema(): ZodType<z.input<TSchema>, string, unknown>;
```

**Returns**

- A new Zod schema with a built-in `transform` method that converts the data into a built prompt.

#### `asPartial()`

Returns a `PartialPromptTemplate` based on a `PromptTemplate`, allowing you to partially apply data over multiple steps.

**Signature**

```typescript
asPartial(): PartialPromptTemplate<TSchema>;
```

**Returns**

- A new `PartialPromptTemplate` instance.

---

### Class: `PartialPromptTemplate<TSchema>`

A template that can be progressively filled with data before finalising. It has the same underlying schema as the original `PromptTemplate`.

#### `partial(data)`

Partially applies data to the template.

**Signature**

```typescript
partial(data: DeepPartial<z.input<TSchema>>): PartialPromptTemplate<TSchema>;
```

**Parameters**

- `data`: A **partial** version of what `TSchema` expects. Each call merges with existing partial data.

**Returns**

- The `PartialPromptTemplate` instance.

#### `build()`

Finalises the partial data, validates it with the original schema, and compiles the template into a string.
Throws Zod validation error if the partial data is not sufficient or invalid.

**Signature**

```typescript
build(): PromptTemplateBuildResult<TSchema>;
```

**Returns**

An object containing:

- `prompt`: The rendered template string
- `metadata`: Object containing:
  - `type`: "partial"
  - `templateStr`: Original template string
  - `data`: The validated/transformed data
  - Optional fields: `templateId`, `experimentId`, `version`, `description`, `custom`

**Throws**

- Zod validation errors if the partial data doesn't match the schema.

#### `buildAsync()`

Finalises the partial data, validates it with the original schema, and compiles the template into a string asynchronously.

**Signature**

```typescript
async buildAsync(): Promise<PromptTemplateBuildResult<TSchema>>;
```

**Returns**

A promise that resolves to an object containing:

- `prompt`: The rendered template string
- `metadata`: Object containing:
  - `type`: "partial"
  - `templateStr`: Original template string
  - `data`: The validated/transformed data
  - Optional fields: `templateId`, `experimentId`, `version`, `description`, `custom`

**Throws**

- Zod validation errors if the partial data doesn't match the schema.

#### `copy()`

Creates a new `PartialPromptTemplate` instance with the same partial data. Useful for creating branches from a partially-applied template without interfering with each other's data.

---

## Contributing

Contributions are welcome! Please read the [contribution guidelines](CONTRIBUTING.md) first.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
