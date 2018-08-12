/**
 * @fileoverview State initialization in an ES6 class component should be in a constructor
 * @author Kanitkorn Sujautra
 */
'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'State initialization in an ES6 class component should be in a constructor',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('state-in-constructor')
    },
    schema: []
  },

  create: Components.detect((context, components, utils) => ({
    ClassProperty: function (node) {
      if (
        !node.static &&
        node.key.name === 'state' &&
        utils.isES6Component(node.parent.parent)
      ) {
        context.report({
          node,
          message: 'State initialization should be in a constructor'
        });
      }
    }
  }))
};
