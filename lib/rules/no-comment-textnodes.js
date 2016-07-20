/**
 * @fileoverview Comments inside children section of tag should be placed inside braces.
 * @author Ben Vinegar
 * @deprecated
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var util = require('util');
var jsxNoCommentTextnodes = require('./jsx-no-comment-textnodes');
var isWarnedForDeprecation = false;

module.exports = function(context) {
  return util._extend(jsxNoCommentTextnodes(context), {
    Program: function() {
      if (isWarnedForDeprecation || /\=-(f|-format)=/.test(process.argv.join('='))) {
        return;
      }

      /* eslint-disable no-console */
      console.log('The react/no-comment-textnodes rule is deprecated. Please ' +
                  'use the react/jsx-no-comment-textnodes rule instead.');
      /* eslint-enable no-console */
      isWarnedForDeprecation = true;
    }
  });
};

module.exports.schema = [{
  type: 'object',
  properties: {},
  additionalProperties: false
}];
