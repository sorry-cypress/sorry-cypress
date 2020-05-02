module.exports = {
  env: {
    browser: true,
    node: true,
  },
  plugins: ["react"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ["plugin:react/recommended"],

  settings: {
    react: {
      version: "16.9.0",
    },
  },
};
