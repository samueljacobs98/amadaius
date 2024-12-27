# Amadaius

Amadaius is a TypeScript/JavaScript library for composing and building text prompt templates. It leverages:

- [Zod](https://github.com/colinhacks/zod) for data validation and transformations.
- [Handlebars](https://github.com/handlebars-lang/handlebars.js/) for templating.
- Optional custom helpers that can be easily plugged in.

> **tl;dr**  
> **Zod** handles schema validation so you know your template data matches exactly what you expect.  
> **Handlebars** compiles your templates into plain strings.  
> **Partial application** allows you to incrementally fill the data required by your prompt.

---

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
   - [Creating a Prompt Template](#creating-a-prompt-template)
   - [Validating and Transforming Data](#validating-and-transforming-data)
   - [Composing Prompt Templates](#composing-prompt-templates)
   - [Partial Templates](#partial-templates)
4. [API Reference](#api-reference)
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
5. [Contributing](#contributing)
6. [License](#license)

---

## Features

- **Zod Validation**: Ensure your template data is correct.
- **Handlebars-based Templating**: Use Handlebars features like conditionals, loops, helpers, and comments.
- **Partial Prompt Templates**: Build complex prompts incrementally, adding or overriding data fields at each step.
- **Asynchronous Support**: Seamlessly handle asynchronous data transformations (`buildAsync`).

---

## Installation

```bash
# Using npm
npm install amadaius

# Using yarn
yarn add amadaius
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

const storySchema = z.object({ topic: z.string() });

// Template references `{{topic}}`
const myPrompt = promptTemplate(storySchema, "Write a story about {{topic}}!");

// Provide data matching the schema
const result = myPrompt.build({ topic: "dragons" });

console.log(result);
// -> "Write a story about dragons!"
```

### Validating and Transforming Data

Zod can do more than just type-check. You can refine, transform, and set default values. If data fails validation, an error is thrown.

```typescript
import { promptTemplate } from "amadaius";
import { z } from "zod";

// Example of refining schema
const userSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .refine((data) => data.id.length === 10, {
    message: "User ID must be exactly 10 characters long",
  });

const userPrompt = promptTemplate(
  userSchema,
  "Hello, {{name}}! Your ID is {{id}}.",
);

try {
  const output = userPrompt.build({ id: "0123456789", name: "Alice" });
  console.log(output);
  // -> "Hello, Alice! Your ID is 0123456789."
} catch (err) {
  console.error(err);
  // If you provide invalid data, e.g. ID is not length 10,
  // you'll get a Zod validation error
}
```

You can also transform data using Zod's `transform` method.

```typescript
const transformSchema = z.string().transform((topic) => ({ topic })); // transforms a string into { topic }

const transformPrompt = promptTemplate(
  transformSchema,
  "Write a story about {{topic}}!",
);

// We can pass just a string; the schema transforms it into { topic }
const transformResult = transformPrompt.build("dinosaurs");

console.log(transformResult);
// -> "Write a story about dinosaurs!"
```

### Composing Prompt Templates

You can convert a `PromptTemplate` into a Zod schema using `asSchema()`. This allows you to compose prompt templates together.

```typescript
import { promptTemplate } from "amadaius";
import { z } from "zod";

// Define smaller prompt templates
const pt1 = promptTemplate(z.object({ name: z.string() }), "Hello, {{name}}!");
const pt2 = promptTemplate(
  z.object({ question: z.string() }),
  "How are you, {{question}}",
);

// Compose them into a single prompt
const result = promptTemplate(
  z.object({ greeting: pt1.asSchema(), request: pt2.asSchema() }),
  "{{greeting}} {{request}}",
).build({
  greeting: { name: "Alice" },
  request: { question: "What is your favorite color?" },
});

console.log(result);
// -> "Hello, Alice! How are you, What is your favorite color?"
```

### Partial Templates

Sometimes you need to **partially apply** data to a template and fill in the rest later. You can convert a `PromptTemplate` into a `PartialPromptTemplate` using `asPartial()` and fill in data incrementally with `partial(data)`.

```typescript
import { promptTemplate } from "amadaius";
import { z } from "zod";

const questionSchema = z.object({
  persona: z.string(),
  message: z.string(),
});

const questionPrompt = promptTemplate(
  questionSchema,
  "You are {{persona}}. Respond to: {{message}}",
);

// Convert to partial template
const partialPrompt = questionPrompt.asPartial();

// Fill data in multiple steps
partialPrompt.partial({ persona: "a knowledgeable AI librarian" });
partialPrompt.partial({ message: "What are the best science fiction books?" });

// When you're ready, build the final string
const partialResult = partialPrompt.build();

console.log(partialResult);
// -> "You are a knowledgeable AI librarian. Respond to: What are the best science fiction books?"
```

You can also **copy** a `PartialPromptTemplate` to create a new instance with the same data.

```typescript
const partialPromptCopy = partialPrompt.copy();
// partialPromptCopy shares the same partial data initially, then you can branch out
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
build(data: z.input<TSchema>): string;
```

**Parameters**

- `data`: Data matching the schema.

**Returns**

- The prompt string.

**Throws**

- Zod validation errors if `data` doesn't match the schema.

#### `buildAsync(data)`

Builds the prompt string asynchronously using the provided data. This enables asynchronous data transformations (e.g., when using `z.transform(async ...)` in Zod).

**Signature**

```typescript
async buildAsync(data: z.input<TSchema>): Promise<string>;
```

**Parameters**

- `data`: Data matching the schema.

**Returns**

- A promise that resolves to the prompt string.

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

Converts the `PromptTemplate` into a `PartialPromptTemplate`, allowing you to partially apply data over multiple steps.

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
build(): string;
```

**Returns**

- The prompt string.

**Throws**

- Zod validation errors if the partial data doesn't match the schema.

#### `buildAsync()`

Finalises the partial data, validates it with the original schema, and compiles the template into a string asynchronously.

**Signature**

```typescript
async buildAsync(): Promise<string>;
```

**Returns**

- A promise that resolves to the prompt string.

**Throws**

- Zod validation errors if the partial data doesn't match the schema.

#### `copy()`

Creates a new `PartialPromptTemplate` instance with the same partial data. Useful for creating branches from a partially-applied template without interfering with each other's data.

---

## Contributing

Contributions are welcome! Please read the [contribution guidelines](CONTRIBUTING.md) first.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
