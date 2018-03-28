/**
 * @fileoverview Prevents usage of componentWillReceiveProps
 */
'use strict';

const Components = require('../util/Components');
const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');

function errorMessage(node) {
  return `${node} should not use componentWillReceiveProps.`;
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevents usage of componentWillReceiveProps',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('no-component-will-receive-props')
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
      const has = hasComponentWillReceiveProps(node);
      if (has) {
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
