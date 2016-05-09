/**
 * @fileoverview Enforce PasalCase for user-defined JSX components
 * @author Jake Marsh
 */

'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var PASCAL_CASE_REGEX = /^([A-Z0-9]|[A-Z0-9]+[a-z0-9]+(?:[A-Z0-9]+[a-z0-9]*)*)$/;
var COMPAT_TAG_REGEX = /^[a-z]|\-/;
var ALL_CAPS_TAG_REGEX = /^[A-Z0-9]+$/;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var configuration = context.options[0] || {};
  var allowAllCaps = configuration.allowAllCaps || false;
  var ignore = configuration.ignore || [];

  return {
    JSXOpeningElement: function(node) {
      switch (node.name.type) {
        case 'JSXIdentifier':
          node = node.name;
          break;
        case 'JSXMemberExpression':
          node = node.name.object;
          break;
        case 'JSXNamespacedName':
          node = node.name.namespace;
          break;
        default:
          break;
      }

      var isPascalCase = PASCAL_CASE_REGEX.test(node.name);
      var isCompatTag = COMPAT_TAG_REGEX.test(node.name);
      var isAllowedAllCaps = allowAllCaps && ALL_CAPS_TAG_REGEX.test(node.name);
      var isIgnored = ignore.indexOf(node.name) !== -1;

      if (!isPascalCase && !isCompatTag && !isAllowedAllCaps && !isIgnored) {
        context.report({
          node: node,
          message: 'Imported JSX component ' + node.name + ' must be in PascalCase'
        });
      }
    }
  };

};

module.exports.schema = [{
  type: 'object',
  properties: {
    allowAllCaps: {
      type: 'boolean'
    },
    ignore: {
      type: 'array'
    }
  },
  additionalProperties: false
}];
