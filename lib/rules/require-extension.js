/**
 * @fileoverview Restrict file extensions that may be required
 * @author Scott Andrews
 * @deprecated
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var util = require('util');
var jsxRequireExtension = require('./jsx-require-extension');
var isWarnedForDeprecation = false;

module.exports = {
  meta: {
    docs: {},

    schema: [{
      type: 'object',
      properties: {
        extensions: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      },
      additionalProperties: false
    }]
  },

  create: function(context) {
    return util._extend(jsxRequireExtension(context), {
      Program: function() {
        if (isWarnedForDeprecation || /\=-(f|-format)=/.test(process.argv.join('='))) {
          return;
        }

        /* eslint-disable no-console */
        console.log('The react/require-extension rule is deprecated. Please ' +
                    'use the react/jsx-require-extension rule instead.');
        /* eslint-enable no-console */
        isWarnedForDeprecation = true;
      }
    });
  }
};
