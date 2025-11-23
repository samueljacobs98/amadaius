// packages/eslint-config/mdx.js
import * as mdx from "eslint-plugin-mdx";

import { config as baseConfig } from "./base.js";

/**
 * ESLint config for MDX-only packages (flat config).
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...baseConfig,

  // Core MDX linting (Markdown + MDX)
  {
    ...mdx.flat,
    files: ["**/*.md", "**/*.mdx"],
    // Optionally enable remark processing & code-block linting:
    // processor: mdx.createRemarkProcessor({ lintCodeBlocks: true }),
  },

  // Optional: apply JS rules inside fenced code blocks
  // (handy if you enabled lintCodeBlocks above)
  {
    ...mdx.flatCodeBlocks,
    files: ["**/*.md", "**/*.mdx"],
    // You can override/extend rules for code blocks here:
    // rules: { "no-var": "error", "prefer-const": "error" },
  },

  // Keep this package focused on MD/MDX only
  {
    ignores: ["**/*.{js,ts,jsx,tsx}"],
  },
];