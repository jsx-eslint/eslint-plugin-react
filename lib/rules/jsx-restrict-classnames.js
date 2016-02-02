/**
 * @fileoverview Restrict certian classNames or classNames which start with a specific prefix
 * @author Nikhilesh Katakam
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var startsWith = function(actualString, prefix, position) {
  position = position || 0;
  return actualString.substr(position, prefix.length) === prefix;
};

var shouldReportError = function(option, className) {
  // if className is restricted, or a className prefix is restricted.
  return option.className === className ||
   (option.isPrefix && startsWith(className, option.className));
};

module.exports = function(context) {
  var options = context.options[0] || [];

  return {
    JSXAttribute: function(node) {
      if (options.length > 0) {
        if (node.name.name === 'className') {
          var classNames = node.value.value.split(' ');
          classNames.forEach(function(className) {
            options.forEach(function(option) {
              if (shouldReportError(option, className)) {
                context.report(node.value, option.message);
              }
            });
          });
        }
      }
    }
  };
};

module.exports.schema = [{
  type: 'array',
  items: {
    type: 'object',
    properties: {
      className: {type: 'string'},
      isPrefix: {type: 'boolean'},
      message: {type: 'string'}
    }
  },
  additionalProperties: false
}];
