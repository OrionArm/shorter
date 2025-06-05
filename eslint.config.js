// eslint.config.js
import path from "path";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends([
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-refresh/recommended",
    "prettier",
  ]),
  {
    files: ["frontend/**/*.{ts,tsx}"],
    ignores: ["**/dist/**", "**/node_modules/**"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["./frontend/tsconfig.app.json"],
        tsconfigRootDir: path.resolve(__dirname),
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React-specific rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    files: ["backend/**/*.ts"],
    ignores: ["**/dist/**", "**/node_modules/**"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["./backend/tsconfig.json"],
        tsconfigRootDir: path.resolve(__dirname),
      },
    },
    rules: {
      // Backend-specific rules
    },
  },
];
