module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-var-requires': 0,
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": 'off',
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-types": [
      "error",
      {
        "extendDefaults": true,
        "types": {
          "{}": false
        }
      }
    ],
    "vue/multi-word-component-names": "off",
  }
}
