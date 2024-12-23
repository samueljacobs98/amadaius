export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PromptTemplateOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  helpers?: Record<string, (...args: any) => any>;
};
