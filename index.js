'use strict';

module.exports = {
  rules: {
    'jsx-uses-react': require('./lib/rules/jsx-uses-react'),
    'no-multi-comp': require('./lib/rules/no-multi-comp'),
    'prop-types': require('./lib/rules/prop-types'),
    'display-name': require('./lib/rules/display-name'),
    'wrap-multilines': require('./lib/rules/wrap-multilines'),
    'self-closing-comp': require('./lib/rules/self-closing-comp'),
    'no-danger': require('./lib/rules/no-danger'),
    'no-did-mount-set-state': require('./lib/rules/no-did-mount-set-state'),
    'no-did-update-set-state': require('./lib/rules/no-did-update-set-state'),
    'react-in-jsx-scope': require('./lib/rules/react-in-jsx-scope'),
    'jsx-uses-vars': require('./lib/rules/jsx-uses-vars'),
    'jsx-no-undef': require('./lib/rules/jsx-no-undef'),
    'jsx-quotes': require('./lib/rules/jsx-quotes'),
    'no-unknown-property': require('./lib/rules/no-unknown-property'),
    'jsx-curly-spacing': require('./lib/rules/jsx-curly-spacing'),
    'jsx-sort-props': require('./lib/rules/jsx-sort-props'),
    'jsx-sort-prop-types': require('./lib/rules/jsx-sort-prop-types'),
    'jsx-boolean-value': require('./lib/rules/jsx-boolean-value'),
    'sort-comp': require('./lib/rules/sort-comp'),
    'require-extension': require('./lib/rules/require-extension')
  },
  rulesConfig: {
    'jsx-uses-react': 0,
    'no-multi-comp': 0,
    'prop-types': 0,
    'display-name': 0,
    'wrap-multilines': 0,
    'self-closing-comp': 0,
    'no-danger': 0,
    'no-did-mount-set-state': 0,
    'no-did-update-set-state': 0,
    'react-in-jsx-scope': 0,
    'jsx-uses-vars': 1,
    'jsx-no-undef': 0,
    'jsx-quotes': 0,
    'no-unknown-property': 0,
    'jsx-curly-spacing': 0,
    'jsx-sort-props': 0,
    'jsx-sort-prop-types': 0,
    'jsx-boolean-value': 0,
    'sort-comp': 0,
    'require-extension': 0
  }
};
