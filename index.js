'use strict';

module.exports = {
  rules: {
    'no-multi-comp': require('./lib/rules/no-multi-comp'),
    'prop-types': require('./lib/rules/prop-types'),
    'display-name': require('./lib/rules/display-name')
  },
  rulesConfig: {
    'no-multi-comp': 0,
    'prop-types': 0,
    'display-name': 0
  }
};
