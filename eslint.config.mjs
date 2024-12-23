import eslint from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

import jestPlugin from "eslint-plugin-jest";

export default [
  // Base ESLint recommended configurations
  eslint.configs.recommended,

  // TypeScript-specific configurations
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // Enable or customize TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Add more TypeScript rules as needed
    },
  },

  // Jest-specific configurations for test files
  {
    files: ["**/__tests__/**/*.{js,ts}", "**/*.test.{js,ts}"],
    languageOptions: {
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      // Enable Jest-specific rules
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
      // Add more Jest rules as needed
    },
  },

  // Prettier integration
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  // Disable ESLint rules that might conflict with Prettier
  prettier,
];
