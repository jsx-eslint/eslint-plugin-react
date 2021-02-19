/**
 * @fileoverview Enforce removal of new lines around jsx components
 * @author Sladyn<sladynnunes98@gmail.com>
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
      newLine: 'JSX element should start in a new line'
    }
  },
  create(context) {
    const jsxElementParents = new Set();
    const sourceCode = context.getSourceCode();
    console.log(sourceCode);
    return {
      'Program:exit'() {
        jsxElementParents.forEach((parent) => {
          console.log('parent', parent);
        });
      }
    };
  }
};
