/**
 * @fileoverview Flag componentWillReceiveProps as deprecated
 */
'use strict';

const Components = require('../util/Components');
const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');

function errorMessage(node) {
  return `${node} should not use deprecated lifecycle method componentWillReceiveProps.`;
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Flag deprecated componentWillReceiveProps',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('no-redundant-should-component-update')
    },
    schema: []
  },

  create: Components.detect(context => {
    /**
     * Checks for componentWillReceiveProps property
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} Whether or not the property exists.
     */
    function hasComponentWillReceiveProps(node) {
      const properties = astUtil.getComponentProperties(node);
      return properties.some(property => {
        const name = astUtil.getPropertyName(property);
        return name === 'componentWillReceiveProps';
      });
    }

    /**
     * Get name of node if available
     * @param {ASTNode} node The AST node being checked.
     * @return {String} The name of the node
     */
    function getNodeName(node) {
      if (node.id) {
        return node.id.name;
      } else if (node.parent && node.parent.id) {
        return node.parent.id.name;
      }
      return '';
    }

    /**
     * Checks for violation of rule
     * @param {ASTNode} node The AST node being checked.
     */
    function checkForViolation(node) {
      if (hasComponentWillReceiveProps(node)) {
        const className = getNodeName(node);
        context.report({
          node: node,
          message: errorMessage(className)
        });
      }
    }

    return {
      ClassDeclaration: checkForViolation,
      ClassExpression: checkForViolation
    };
  })
};
