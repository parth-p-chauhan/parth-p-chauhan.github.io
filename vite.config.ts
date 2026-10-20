import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    printWidth: 80,
    tabWidth: 2,
    semi: true,
    singleQuote: false,
    trailingComma: "all",
    arrowParens: "always",
    sortImports: true,
    ignorePatterns: [".agents/**", "skills-lock.json"],
  },
  lint: {
    plugins: ["typescript", "unicorn", "oxc", "react", "nextjs", "jsx-a11y"],
    categories: {
      correctness: "error",
      suspicious: "warn",
    },
    env: {
      builtin: true,
      browser: true,
      node: true,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  staged: {
    "*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}": "vp lint --fix",
    "*.{js,jsx,ts,tsx,mjs,cjs,mts,cts,json,jsonc,css,md,yml,yaml}":
      "vp fmt --write",
  },
});
