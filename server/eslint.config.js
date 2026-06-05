import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.ts", "tests/**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    plugins: {
      "@typescript-eslint": typescriptEslint
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
  }
];
