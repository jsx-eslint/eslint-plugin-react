/**
 * @fileoverview Flag shouldComponentUpdate when extending PureComponent
 */
'use strict';

const Components = require('../util/Components');
const astUtil = require('../util/ast');

function errorMessage(node) {
  return `${node} does not need shouldComponentUpdate when extending React.PureComponent.`;
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Flag shouldComponentUpdate when extending PureComponent',
      category: 'Possible Errors',
      recommended: false
    },
    schema: []
  },

  create: Components.detect((context, components, utils) => {
    /**
     * Get properties for a given AST node
     * @param {ASTNode} node The AST node being checked.
     * @returns {Array} Properties array.
     */
    function getComponentProperties(node) {
      switch (node.type) {
        case 'ClassExpression':
        case 'ClassDeclaration':
          return node.body.body;
        default:
          return [];
      }
    }

    /**
     * Checks for shouldComponentUpdate property
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} Whether or not the property exists.
     */
    function hasShouldComponentUpdate(node) {
      const properties = getComponentProperties(node);
      return properties.some(property => {
        const name = astUtil.getPropertyName(property);
        return name === 'shouldComponentUpdate';
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
      if (utils.isPureComponent(node)) {
        const hasScu = hasShouldComponentUpdate(node);
        if (hasScu) {
          const className = getNodeName(node);
          context.report({
            node: node,
            message: errorMessage(className)
          });
        }
      }
    }

    return {
      ClassDeclaration: checkForViolation,
      ClassExpression: checkForViolation
    };
  })
};
