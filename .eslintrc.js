module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["plugin:vue/vue3-recommended"],
  parserOptions: {
    ecmaVersion: 11,
    parser: "@typescript-eslint/parser",
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {},
};
