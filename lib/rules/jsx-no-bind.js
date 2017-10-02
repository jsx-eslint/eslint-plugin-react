/**
 * @fileoverview Prevents usage of Function.prototype.bind and arrow functions
 *               in React component props.
 * @author Daniel Lo Nigro <dan.cx>, Jacky Ho
 */
'use strict';

const Components = require('../util/Components');
const propName = require('jsx-ast-utils/propName');

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

const bindViolationMessage = 'JSX props should not use .bind()';
const arrowViolationMessage = 'JSX props should not use arrow functions';
const BindExpressionViolationMessage = 'JSX props should not use ::';

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

    // This contains the variable names that are defined in the current class
    // method and reference a `bind` call expression or an arrow function. This
    // needs to be set to an empty Set after each class method defintion.
    let currentArrowViolationVariableNames = new Set();
    let currentBindViolationVariableNames = new Set();
    let currentBindExpressionViolationVariableNames = new Set();

    function resetVariableNameSets() {
      currentArrowViolationVariableNames = new Set();
      currentBindViolationVariableNames = new Set();
      currentBindExpressionViolationVariableNames = new Set();
    }

    function reportVariableViolation(node, name) {
      if (currentBindViolationVariableNames.has(name)) {
        context.report({node: node, message: bindViolationMessage});
      } else if (currentArrowViolationVariableNames.has(name)) {
        context.report({node: node, message: arrowViolationMessage});
      } else if (
        currentBindExpressionViolationVariableNames.has(name)
      ) {
        context.report({node: node, message: BindExpressionViolationMessage});
      }
    }

    return {
      'MethodDefinition:exit'() {
        resetVariableNameSets();
      },

      'ClassProperty:exit'(node) {
        if (
          !node.static &&
          node.value &&
          node.value.type === 'ArrowFunctionExpression'
        ) {
          resetVariableNameSets();
        }
      },

      VariableDeclarator(node) {
        const name = node.id.name;
        const init = node.init;
        const initType = init.type;

        if (
          !configuration.allowBind &&
          initType === 'CallExpression' &&
          init.callee.type === 'MemberExpression' &&
          init.callee.property.type === 'Identifier' &&
          init.callee.property.name === 'bind'
        ) {
          currentBindViolationVariableNames.add(name);
        } else if (
          !configuration.allowArrowFunctions &&
          initType === 'ArrowFunctionExpression'
        ) {
          currentArrowViolationVariableNames.add(name);
        } else if (
          !configuration.allowBind &&
          initType === 'BindExpression'
        ) {
          currentBindExpressionViolationVariableNames.add(name);
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
          reportVariableViolation(node, valueNode.name);
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
          context.report({node: node, message: BindExpressionViolationMessage});
        }
      }
    };
  })
};
