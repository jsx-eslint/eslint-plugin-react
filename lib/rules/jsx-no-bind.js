/**
 * @fileoverview Prevents usage of Function.prototype.bind and arrow functions
 *               in React component props.
 * @author Daniel Lo Nigro <dan.cx>
 * @author Jacky Ho
 */
'use strict';

const Components = require('../util/Components');
const propName = require('jsx-ast-utils/propName');

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

const bindViolationMessage = 'JSX props should not use .bind()';
const arrowViolationMessage = 'JSX props should not use arrow functions';
const bindExpressionViolationMessage = 'JSX props should not use ::';

module.exports = {
  meta: {
    docs: {
      description: 'Prevents usage of Function.prototype.bind and arrow functions in React component props',
      category: 'Best Practices',
      recommended: false
    },

    schema: [{
      type: 'object',
      properties: {
        allowArrowFunctions: {
          default: false,
          type: 'boolean'
        },
        allowBind: {
          default: false,
          type: 'boolean'
        },
        ignoreRefs: {
          default: false,
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: Components.detect(context => {
    const configuration = context.options[0] || {};

    // Keep track of all the variable names pointing to a bind call,
    // bind expression or an arrow function in different block statements
    const blockVariableNameSets = {};

    function setBlockVariableNameSet(blockStart) {
      blockVariableNameSets[blockStart] = {
        arrowFunc: new Set(),
        bindCall: new Set(),
        bindExpression: new Set()
      };
    }

    function getVariableViolationType(rightNode) {
      const nodeType = rightNode.type;

      if (
        !configuration.allowBind &&
        nodeType === 'CallExpression' &&
        rightNode.callee.type === 'MemberExpression' &&
        rightNode.callee.property.type === 'Identifier' &&
        rightNode.callee.property.name === 'bind'
      ) {
        return 'bindCall';
      } else if (
        !configuration.allowArrowFunctions &&
        nodeType === 'ArrowFunctionExpression'
      ) {
        return 'arrowFunc';
      } else if (
        !configuration.allowBind &&
        nodeType === 'BindExpression'
      ) {
        return 'bindExpression';
      }

      return null;
    }

    function addVariableNameToSet(violationType, variableName, blockStart) {
      blockVariableNameSets[blockStart][violationType].add(variableName);
    }

    function getBlockStatementAncestors(node) {
      return context.getAncestors(node).reverse().filter(
        ancestor => ancestor.type === 'BlockStatement'
      );
    }

    function reportVariableViolation(node, name, blockStart) {
      const blockSets = blockVariableNameSets[blockStart];

      if (blockSets.bindCall.has(name)) {
        context.report({node: node, message: bindViolationMessage});
        return true;
      } else if (blockSets.arrowFunc.has(name)) {
        context.report({node: node, message: arrowViolationMessage});
        return true;
      } else if (blockSets.bindExpression.has(name)) {
        context.report({node: node, message: bindExpressionViolationMessage});
        return true;
      }

      return false;
    }

    function findVariableViolation(node, name) {
      getBlockStatementAncestors(node).find(
        block => reportVariableViolation(node, name, block.start)
      );
    }

    return {
      BlockStatement(node) {
        setBlockVariableNameSet(node.start);
      },

      VariableDeclarator(node) {
        const blockAncestors = getBlockStatementAncestors(node);
        const variableViolationType = getVariableViolationType(node.init);

        if (blockAncestors.length > 0 && variableViolationType) {
          addVariableNameToSet(
            variableViolationType, node.id.name, blockAncestors[0].start
          );
        }
      },

      JSXAttribute: function(node) {
        const isRef = configuration.ignoreRefs && propName(node) === 'ref';
        if (isRef || !node.value || !node.value.expression) {
          return;
        }
        const valueNode = node.value.expression;
        const valueNodeType = valueNode.type;

        if (valueNodeType === 'Identifier') {
          findVariableViolation(node, valueNode.name);
        } else if (
          !configuration.allowBind &&
          valueNodeType === 'CallExpression' &&
          valueNode.callee.type === 'MemberExpression' &&
          valueNode.callee.property.name === 'bind'
        ) {
          context.report({node: node, message: bindViolationMessage});
        } else if (
          !configuration.allowArrowFunctions &&
          valueNodeType === 'ArrowFunctionExpression'
        ) {
          context.report({node: node, message: arrowViolationMessage});
        } else if (
          !configuration.allowBind &&
          valueNodeType === 'BindExpression'
        ) {
          context.report({node: node, message: bindExpressionViolationMessage});
        }
      }
    };
  })
};
