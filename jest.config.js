/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
};
