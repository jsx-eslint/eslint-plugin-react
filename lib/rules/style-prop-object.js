/**
 * @fileoverview Enforce style prop value is an object
 * @author David Petersen
 */
'use strict';

const variableUtil = require('../util/variable');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce style prop value is an object',
      category: '',
      recommended: false,
      url: docsUrl('style-prop-object')
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      }
    ]
  },

  create: function(context) {
    const allowed = context.options.length > 0 && context.options[0].allow || [];

    /**
     * @param {object} node An Identifier node
     */
    function isNonNullaryLiteral(expression) {
      return expression.type === 'Literal' && expression.value !== null;
    }

    /**
     * @param {object} node A Identifier node
     */
    function checkIdentifiers(node) {
      const variable = variableUtil.variablesInScope(context).find(item => item.name === node.name);

      if (!variable || !variable.defs[0] || !variable.defs[0].node.init) {
        return;
      }

      if (isNonNullaryLiteral(variable.defs[0].node.init)) {
        context.report(node, 'Style prop value must be an object');
      }
    }

    return {
      CallExpression: function(node) {
        if (
          node.callee
          && node.callee.type === 'MemberExpression'
          && node.callee.property.name === 'createElement'
          && node.arguments.length > 1
        ) {
          if (node.arguments[1].type === 'ObjectExpression') {
            const style = node.arguments[1].properties.find(property => property.key && property.key.name === 'style' && !property.computed);
            if (style) {
              if (style.value.type === 'Identifier') {
                checkIdentifiers(style.value);
              } else if (isNonNullaryLiteral(style.value)) {
                context.report(style.value, 'Style prop value must be an object');
              }
            }
          }
        }
      },

      JSXAttribute: function(node) {
        if (!node.value || node.name.name !== 'style') {
          return;
        }

        // parent element is a JSXOpeningElement
        if (node.parent && node.parent.type === 'JSXOpeningElement') {

          // store parent element
          const jsxOpeningElement = node.parent;

          // get the name of the JSX element
          const name = jsxOpeningElement.name && jsxOpeningElement.name.name;

          // allowed list contains the name
          if (allowed.indexOf(name) > -1) {
            // abort operation
            return;
          }
        }

        if (node.value.type !== 'JSXExpressionContainer' || isNonNullaryLiteral(node.value.expression)) {
          context.report(node, 'Style prop value must be an object');
        } else if (node.value.expression.type === 'Identifier') {
          checkIdentifiers(node.value.expression);
        }
      }
    };
  }
};
