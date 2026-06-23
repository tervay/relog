import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "unicorn", "oxc", "import", "promise"],
  env: { node: true, es2024: true },
  categories: { correctness: "error", suspicious: "warn" },
  rules: {
    "no-underscore-dangle": ["warn", { allow: ["__dirname", "__filename"] }],
  },
});
