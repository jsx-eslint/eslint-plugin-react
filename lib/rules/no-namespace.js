/**
 * @fileoverview Enforce that namespaces are not used in React elements
 * @author Yacine Hmito
 */

'use strict';

const elementType = require('jsx-ast-utils/elementType');
const docsUrl = require('../util/docsUrl');
const isCreateElement = require('../util/isCreateElement');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce that namespaces are not used in React elements',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('no-namespace')
    },

    schema: [{
      type: 'object',
      additionalProperties: false
    }]
  },

  create(context) {
    return {
      CallExpression(node) {
        if (isCreateElement(node, context) && node.arguments.length > 0 && node.arguments[0].type === 'Literal') {
          const name = node.arguments[0].value;
          if (name.indexOf(':') === -1) return undefined;
          const message = `React component ${name} must not be in a namespace as React does not support them`;
          context.report({node, message});
        }
      },
      JSXOpeningElement(node) {
        const name = elementType(node);
        if (name.indexOf(':') === -1) return undefined;
        const message = `React component ${name} must not be in a namespace as React does not support them`;
        context.report({node, message});
      }
    };
  }
};
