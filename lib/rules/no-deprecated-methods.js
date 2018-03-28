/**
 * @fileoverview Prevents usage of deprecated component lifecycle methods
 */
'use strict';

const Components = require('../util/Components');
const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');

function errorMessage(node, method) {
  return `${node} should not use ${method}.`;
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevents usage of deprecated component lifecycle methods',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('no-deprecated-methods')
    },
    schema: [{
      type: 'object',
      properties: {
        componentWillMount: {
          type: 'boolean'
        },
        componentWillReceiveProps: {
          type: 'boolean'
        },
        componentWillUpdate: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: Components.detect((context, components, utils) => {
    const defaults = {
      componentWillMount: true,
      componentWillReceiveProps: true,
      componentWillUpdate: true
    };
    const configuration = Object.assign({}, defaults, context.options[0] || {});
    const methods = Object.keys(configuration).filter(key => configuration[key]);
    /**
     * Returns deprecated method if available
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} Whether or not the property exists.
     */
    function getDeprecatedMethods(node) {
      const properties = astUtil.getComponentProperties(node);
      return properties
        .map(property => astUtil.getPropertyName(property))
        .filter(name => methods.indexOf(name) !== -1);
    }

    /**
     * Gets name of node if available
     * @param {ASTNode} node The AST node being checked.
     * @return {String} The name of the node
     */
    function getNodeName(node) {
      if (node.id) {
        return node.id.name;
      } else if (node.parent && node.parent.id) {
        return node.parent.id.name;
      } else if (node.parent && node.parent.parent && node.parent.parent.id) {
        return node.parent.parent.id.name;
      }
      return '';
    }

    /**
     * Checks for violation of rule
     * @param {ASTNode} node The AST node being checked.
     */
    function checkForViolation(node) {
      if (utils.isES5Component(node) || utils.isES6Component(node)) {
        const deprecatedMethods = getDeprecatedMethods(node);
        if (deprecatedMethods && deprecatedMethods.length) {
          const className = getNodeName(node);
          deprecatedMethods.forEach(method => {
            context.report({
              node: node,
              message: errorMessage(className, method)
            });
          });
        }
      }
    }

    return {
      ClassDeclaration: checkForViolation,
      ClassExpression: checkForViolation,
      ObjectExpression: checkForViolation
    };
  })
};
