'use strict';

const all = require('./all');

module.exports = Object.assign({}, all, {
  languageOptions: Object.assign({}, all.languageOptions, {
    parserOptions: Object.assign({}, all.languageOptions.parserOptions, {
      jsxPragma: null, // for @typescript/eslint-parser
    }),
  }),
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/jsx-uses-react': 0,
  },
});
