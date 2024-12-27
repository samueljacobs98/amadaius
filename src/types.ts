import { HelperDelegate } from "handlebars";

/**
 * Converts a type to a type where all properties are optional.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 *  Configuration options for a PromptTemplate instance.
 */
export type PromptTemplateOptions = {
  helpers?: Record<string, HelperDelegate>;
};
