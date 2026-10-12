import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Colours must come from the design tokens in globals.css (bg-card, text-danger-emphasis …),
// not raw Tailwind palette classes or hex values, so light/dark and the brand stay consistent.
const PALETTE =
  "(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)";
const UTILITY =
  "(bg|text|border|ring|from|to|via|fill|stroke|divide|outline|placeholder|decoration|shadow|accent|caret)";
const RAW_COLOR = `\\b${UTILITY}-(${PALETTE}-\\d|\\[#)`;
const rawColorMessage =
  "Use a design token (e.g. bg-card, text-muted-foreground, bg-danger-subtle) instead of a raw palette colour. See src/app/globals.css.";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: `Literal[value=/${RAW_COLOR}/]`, message: rawColorMessage },
        { selector: `TemplateElement[value.raw=/${RAW_COLOR}/]`, message: rawColorMessage },
      ],
    },
  },
  {
    files: ["__tests__/**/*.{ts,tsx}", "e2e/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

export default eslintConfig;
