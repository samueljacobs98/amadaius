module.exports = {
  // Import sorting configuration
  importOrder: [
    // React and Next.js imports first
    "^react$",
    "^next/(.*)$",
    // Third-party libraries
    "<THIRD_PARTY_MODULES>",
    // Internal workspace packages
    "^@repo/(.*)$",
    // Internal app imports (absolute paths starting with @/)
    "^@/(.*)$",
    // Relative imports
    "^[./]",
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderSideEffects: true,
  importOrderImportAttributesKeyword: "with",

  // Standard prettier options
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
  endOfLine: "lf",

  // Plugins
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};