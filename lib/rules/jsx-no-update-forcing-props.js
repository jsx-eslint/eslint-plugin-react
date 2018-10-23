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
    const getErrorMessage = type => `${type} must be defined outside attributes to avoid unnecessary updates.`;

    return {
      JSXAttribute(node) {
        const value = node.value;

        if (value === null) {
          // <App foo />
          return;
        }

        if (!value.expression) {
          // <App foo="bar" />
          return;
        }

        const type = value.expression.type;

        if (type === 'ObjectExpression') {
          // <App foo={{}} />
          context.report({
            node: node,
            message: getErrorMessage('Objects')
          });
        }

        if (type === 'ArrayExpression') {
          // <App foo={[] />
          context.report({
            node: node,
            message: getErrorMessage('Arrays')
          });
        }

        if (type === 'FunctionExpression' || type === 'ArrowFunctionExpression') {
          context.report({
            node: node,
            message: getErrorMessage('Functions')
          });
        }

        if (type === 'NewExpression') {
          context.report({
            node: node,
            message: getErrorMessage('Constructor expressions')
          });
        }

        if (type === 'CallExpression') {
          context.report({
            node: node,
            message: getErrorMessage('Function calls')
          });
        }
      }
    };
  }
};
