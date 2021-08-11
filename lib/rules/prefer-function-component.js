/**
 * @fileoverview Enforce function components over class components
 * @author Tate Thurston
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const Components = require('../util/Components');
const ast = require('../util/ast');

const COMPONENT_SHOULD_BE_FUNCTION = 'componentShouldBeFunction';
const ALLOW_COMPONENT_DID_CATCH = 'allowComponentDidCatch';
const COMPONENT_DID_CATCH = 'componentDidCatch';

module.exports = {
  meta: {
    docs: {
      description: 'Enforce components are written as function components',
      category: 'Stylistic Issues',
      recommended: false,
      suggestion: false,
      url: docsUrl('prefer-function-component')
    },
    fixable: false,
    type: 'problem',
    messages: {
      [COMPONENT_SHOULD_BE_FUNCTION]:
        'Class component should be written as a function'
    },
    schema: [
      {
        type: 'object',
        properties: {
          [ALLOW_COMPONENT_DID_CATCH]: {
            default: true,
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ]
  },

  create: Components.detect((context, components, utils) => {
    const allowComponentDidCatchOption = context.options[0] && context.options[0].allowComponentDidCatch;
    const allowComponentDidCatch = allowComponentDidCatchOption !== false;

    function shouldPreferFunction(node) {
      if (!allowComponentDidCatch) {
        return true;
      }

      const properties = ast
        .getComponentProperties(node)
        .map(ast.getPropertyName);
      return !properties.includes(COMPONENT_DID_CATCH);
    }

    const detect = (guard) => (node) => {
      if (guard(node) && shouldPreferFunction(node)) {
        components.set(node, {
          [COMPONENT_SHOULD_BE_FUNCTION]: true
        });
      }
    };

    return {
      ObjectExpression: detect(utils.isES5Component),
      ClassDeclaration: detect(utils.isES6Component),
      ClassExpression: detect(utils.isES6Component),

      'Program:exit'() {
        const list = components.list();
        Object.values(list).forEach((component) => {
          if (component[COMPONENT_SHOULD_BE_FUNCTION]) {
            context.report({
              node: component.node,
              messageId: COMPONENT_SHOULD_BE_FUNCTION
            });
          }
        });
      }
    };
  })
};
