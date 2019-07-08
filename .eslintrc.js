module.exports = {
    root: true,
    parserOptions: {
      parser: 'babel-eslint',
      sourceType: 'module',
    },
    env: {
      browser: true,
      es6: true,
      jest: true
    },
    extends: ['eslint:recommended', 'standard', 'plugin:vue/recommended'],
    plugins: ['vue'],
    rules: {
        "vue/html-closing-bracket-newline": 0,
        "vue/singleline-html-element-content-newline": 0,
        "vue/max-attributes-per-line": ["warn", {
          "singleline": 3,
          "multiline": {
            "max": 1,
            "allowFirstLine": false
          }
        }],
    },
    globals:{
      page: true,
      browser: true,
      context: true,
      jestPuppeteer: true
    }
  }