/**
 * @fileoverview Prevent missing parentheses around multilines JSX
 * @author Yannick Croissant
 * @deprecated
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var util = require('util');
var jsxWrapMultilines = require('./jsx-wrap-multilines');
var isWarnedForDeprecation = false;

module.exports = function(context) {
  return util._extend(jsxWrapMultilines(context), {
    Program: function() {
      if (isWarnedForDeprecation || /\=-(f|-format)=/.test(process.argv.join('='))) {
        return;
      }

      /* eslint-disable no-console */
      console.log('The react/wrap-multilines rule is deprecated. Please ' +
                  'use the react/jsx-wrap-multilines rule instead.');
      /* eslint-enable no-console */
      isWarnedForDeprecation = true;
    }
  });
};

module.exports.schema = [{
  type: 'object',
  properties: {
    declaration: {
      type: 'boolean'
    },
    assignment: {
      type: 'boolean'
    },
    return: {
      type: 'boolean'
    }
  },
  additionalProperties: false
}];
