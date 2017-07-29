/**
 * @fileoverview Prevent using string literals in React component definition
 * @author Caleb Morris
 * @author David Buchan-Swanson
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent using string literals in React component definition',
      category: 'Stylistic Issues',
      recommended: false
    },

    schema: [{
      type: 'object',
      properties: {
        noStrings: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: function(context) {
    const isNoStrings = context.options[0] ? context.options[0].noStrings : false;

    const message = isNoStrings ?
      'Strings not allowed in JSX files' :
      'Missing JSX expression container around literal string';

    function reportLiteralNode(node) {
      context.report({
        node: node,
        message: message
      });
    }

    function getValidation(node) {
      const standard = !/^[\s]+$/.test(node.value) &&
          typeof node.value === 'string' &&
          node.parent &&
          node.parent.type.indexOf('JSX') !== -1 &&
          node.parent.type !== 'JSXAttribute';
      if (isNoStrings) {
        return standard;
      }
      return standard && node.parent.type !== 'JSXExpressionContainer';
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      Literal: function(node) {
        if (getValidation(node)) {
          reportLiteralNode(node);
        }
      },

      TemplateLiteral: function(node) {
        if (isNoStrings && node.parent.type === 'JSXExpressionContainer') {
          reportLiteralNode(node);
        }
      }

    };
  }
};
