/**
 * @fileoverview Disallow padding blank lines in the children of a JSX element
 * @author Chiawen Chen
 */

'use strict';

const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow padding blank lines in the children of a JSX element.',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-no-padded-children')
    },
    fixable: 'whitespace',
    type: 'layout'
  },

  create: function(context) {
    const message = 'JSX children must not be padded by blank lines.';

    /**
     * Test wether input string has 2 or more `\n` .
     * @param {string} str String to test
     * @returns {boolean} Result
      */
    function hasTwoNewlines(str) {
      let count = 0;
      for (const c of str) {
        if (c === '\n') {
          count += 1;
          if (count >= 2) {
            return true;
          }
        }
      }
      return false;
    }


    function checkPaddingTop (node) {
      const child = node.children[0];

      if (child && (child.type === 'JSXText' || child.type === 'Literal')) {
        const match = /^\s*/.exec(child.raw);
        const leadingSpaces = match && match[0];

        if (leadingSpaces && hasTwoNewlines(leadingSpaces)) {
          context.report({
            node: child,
            message,
            fix(fixer) {
              return fixer.removeRange([
                child.start + leadingSpaces.indexOf('\n'),
                child.start + leadingSpaces.lastIndexOf('\n')
              ]);
            }
          });
        }
      }
    }

    function checkPaddingBottom (node) {
      const child = node.children[node.children.length - 1];

      if (child && (child.type === 'JSXText' || child.type === 'Literal')) {
        const match = /\s*$/.exec(child.raw);
        const trailingSpaces = match && match[0];
        const paddingStart = match && match.index;

        if (trailingSpaces && hasTwoNewlines(trailingSpaces)) {
          context.report({
            node: child,
            message,
            fix(fixer) {
              return fixer.removeRange([
                child.start + paddingStart + trailingSpaces.indexOf('\n'),
                child.start + paddingStart + trailingSpaces.lastIndexOf('\n')
              ]);
            }
          });
        }
      }
    }

    function checkElement(node) {
      if (node.children.length === 1 && /^\s*$/.test(node.children[0].raw)) {
        checkPaddingTop(node);
        return;
      }
      checkPaddingTop(node);
      checkPaddingBottom(node);
    }

    return {
      JSXElement: checkElement,
      JSXFragment: checkElement
    };
  }
};
