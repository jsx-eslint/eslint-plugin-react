/**
 * @fileoverview Enforce a new line after jsx elements and expressions.
 * @author Johnny Zabala
 */

'use strict';

const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce a new line after jsx elements and expressions',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-newline')
    },
    fixable: 'code',

    messages: {
      newLine: 'JSX element should start in a new line',
      noNewLine: 'JSX elements should avoid new lines around them'
    },

    schema: [{
      type: 'object',
      properties: {
        removeNewLines: {
          default: false,
          type: 'boolean'
        }
      }
    }]

  },
  create(context) {
    const configuration = context.options[0] || {};
    const jsxElementParents = new Set();
    const sourceCode = context.getSourceCode();
    return {
      'Program:exit'() {
        jsxElementParents.forEach((parent) => {
          if (configuration.removeNewLines) {
            parent.children.forEach((element) => {
              if (element.type === 'JSXText') {
                if (/\n/.test(element.value)) {
                  console.log('This is an endline');
                }
              }
            });
          } else {
            parent.children.forEach((element, index, elements) => {
              if (element.type === 'JSXElement' || element.type === 'JSXExpressionContainer') {
                const firstAdjacentSibling = elements[index + 1];
                const secondAdjacentSibling = elements[index + 2];
                if (
                  firstAdjacentSibling
                && secondAdjacentSibling
                && (firstAdjacentSibling.type === 'Literal' || firstAdjacentSibling.type === 'JSXText')
                // Check adjacent sibling has the proper amount of newlines
                && !/\n\s*\n/.test(firstAdjacentSibling.value)
                ) {
                  context.report({
                    node: secondAdjacentSibling,
                    messageId: 'newLine',
                    fix(fixer) {
                      return fixer.replaceText(
                        firstAdjacentSibling,
                        // double the last newline.
                        sourceCode.getText(firstAdjacentSibling)
                          .replace(/(\n)(?!.*\1)/g, '\n\n')
                      );
                    }
                  });
                }
              }
            });
          }
        });
      },
      ':matches(JSXElement, JSXFragment) > :matches(JSXElement, JSXExpressionContainer)': (node) => {
        jsxElementParents.add(node.parent);
      }
    };
  }
};
