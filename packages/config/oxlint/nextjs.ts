import { defineConfig } from "oxlint";
import base from "./base.ts";

export default defineConfig({
  ...base,
  plugins: ["typescript", "unicorn", "oxc", "import", "promise", "react", "jsx-a11y", "nextjs"],
  env: { node: true, es2024: true, browser: true },
  rules: {
    "react/react-in-jsx-scope": "off",
  },
});
