/**
 * @fileoverview Prevent usage of props that would cause the component to render every time its parent renders
 * @author Wojciech Maj
 */
'use strict';

const docsUrl = require('../util/docsUrl');

module.exports = {
  meta: {
    docs: {
      description: 'Prevent usage of props that would cause the component to render every time its parent renders',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('jsx-no-update-forcing-props')
    },
    schema: []
  },

  // eslint-disable-next-line
  create(context) {
    const typeToName = {
      ObjectExpression: 'Objects',
      ArrayExpression: 'Arrays',
      FunctionExpression: 'Functions',
      ArrowFunctionExpression: 'Functions',
      NewExpression: 'Constructor expressions',
      CallExpression: 'Function calls'
    };

    const getErrorMessage = valueNodeType => `${typeToName[valueNodeType]} must be defined outside attributes to avoid unnecessary updates.`;

    return {
      JSXAttribute(node) {
        if (!node.value || !node.value.expression) {
          return;
        }

        const valueNode = node.value.expression;
        const valueNodeType = valueNode.type;

        if (
          valueNodeType === 'ObjectExpression' // <App foo={{}} />
          || valueNodeType === 'ArrayExpression' // <App foo={[] />
          || valueNodeType === 'FunctionExpression'
          || valueNodeType === 'ArrowFunctionExpression'
          || valueNodeType === 'NewExpression' // <App foo={new Date()} />
          || valueNodeType === 'CallExpression' // <App foo={Symbol('')} />
        ) {
          context.report({
            node,
            message: getErrorMessage(valueNodeType)
          });
        }
      }
    };
  }
};
