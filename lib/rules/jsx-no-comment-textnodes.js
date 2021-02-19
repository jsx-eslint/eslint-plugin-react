/**
 * @fileoverview Comments inside children section of tag should be placed inside braces.
 * @author Ben Vinegar
 */

'use strict';

const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function checkText(node, context) {
  // since babel-eslint has the wrong node.raw, we'll get the source text
  const rawValue = context.getSourceCode().getText(node);
  if (/^\s*\/(\/|\*)/m.test(rawValue)) {
    // inside component, e.g. <div>literal</div>
    if (
      node.parent.type !== 'JSXAttribute'
      && node.parent.type !== 'JSXExpressionContainer'
      && node.parent.type.indexOf('JSX') !== -1
    ) {
      context.report({
        node,
        message: 'Comments inside children section of tag should be placed inside braces'
      });
    }
  }
}

module.exports = {
  meta: {
    docs: {
      description: 'Comments inside children section of tag should be placed inside braces',
      category: 'Possible Errors',
      recommended: true,
      url: docsUrl('jsx-no-comment-textnodes')
    },

    schema: [{
      type: 'object',
      properties: {},
      additionalProperties: false
    }]
  },

  create(context) {
    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      Literal(node) {
        checkText(node, context);
      },
      JSXText(node) {
        checkText(node, context);
      }
    };
  }
};
