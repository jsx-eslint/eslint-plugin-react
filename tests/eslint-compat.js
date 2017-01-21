'use strict';

var isEslint2 = require('eslint/package.json').version.slice(0, 2) === '2.';

module.exports = {
  isEslint2: function () {
    return isEslint2;
  },
  dot: function dot(msg) {
    return isEslint2 ? msg : msg + '.';
  }
};
