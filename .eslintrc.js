// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ["airbnb-base", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "prettier", "jest"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "no-use-before-define": "off",
    "no-useless-constructor": "off",
    "no-empty-function": "off",
    "import/prefer-default-export": "off",
    "no-restricted-syntax": "off",
    "no-return-await": "off",
    "class-methods-use-this": "off",
    "no-plusplus": "off",
    "import/no-useless-path-segments": "off"
  },
};
