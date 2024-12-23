// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  tseslint.config(eslint.configs.recommended, tseslint.configs.recommended),

  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  prettier,
];
