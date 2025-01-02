import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2021,
      globals: globals.browser, // Includes browser globals for these files
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off", // Allow console logs in your project
    },
  },
  {
    files: ["**/*.mjs"],
    languageOptions: {
      sourceType: "module", // ES module files
      ecmaVersion: 2021,
      globals: globals.browser,
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
];
