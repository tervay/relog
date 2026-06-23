import { defineConfig } from "oxlint";
import base from "@relog/config/oxlint/base.ts";

export default defineConfig({
  extends: [base],
  rules: {
    "no-underscore-dangle": ["warn", { allow: ["__dirname", "__filename", "protected_"] }],
  },
});
