/**
 * @fileoverview Prevent using string literals in React component definition
 * @author Caleb Morris
 * @author David Buchan-Swanson
 */

'use strict';

const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent using string literals in React component definition',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-no-literals')
    },

    schema: [{
      type: 'object',
      properties: {
        noStrings: {
          type: 'boolean'
        },
        allowedStrings: {
          type: 'array',
          uniqueItems: true,
          items: {
            type: 'string'
          }
        }
      },
      additionalProperties: false
    }]
  },

  create(context) {
    function trimIfString(val) {
      return typeof val === 'string' ? val.trim() : val;
    }

    const defaults = {noStrings: false, allowedStrings: []};
    const config = Object.assign({}, defaults, context.options[0] || {});
    config.allowedStrings = new Set(config.allowedStrings.map(trimIfString));

    const message = config.noStrings ?
      'Strings not allowed in JSX files' :
      'Missing JSX expression container around literal string';

    function reportLiteralNode(node) {
      context.report({
        node,
        message: `${message}: “${context.getSourceCode().getText(node).trim()}”`
      });
    }

    function getParentIgnoringBinaryExpressions(node) {
      let current = node;
      while (current.parent.type === 'BinaryExpression') {
        current = current.parent;
      }
      return current.parent;
    }

    function getValidation(node) {
      if (config.allowedStrings.has(trimIfString(node.value))) {
        return false;
      }
      const parent = getParentIgnoringBinaryExpressions(node);
      const standard = !/^[\s]+$/.test(node.value) &&
          typeof node.value === 'string' &&
          parent.type.indexOf('JSX') !== -1 &&
          parent.type !== 'JSXAttribute';
      if (config.noStrings) {
        return standard;
      }
      return standard && parent.type !== 'JSXExpressionContainer';
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      Literal(node) {
        if (getValidation(node)) {
          reportLiteralNode(node);
        }
      },

      JSXText(node) {
        if (getValidation(node)) {
          reportLiteralNode(node);
        }
      },

      TemplateLiteral(node) {
        const parent = getParentIgnoringBinaryExpressions(node);
        if (config.noStrings && parent.type === 'JSXExpressionContainer') {
          reportLiteralNode(node);
        }
      }

    };
  }
};
