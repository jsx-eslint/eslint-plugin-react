/**
 * @fileoverview Prevents usage of Function.prototype.bind and arrow functions
 *               in React component props.
 * @author Daniel Lo Nigro <dan.cx>
 * @author Jacky Ho
 */

'use strict';

const propName = require('jsx-ast-utils/propName');
const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const jsxUtil = require('../util/jsx');
const astUtil = require('../util/ast');

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevents usage of Function.prototype.bind and arrow functions in React component props',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('jsx-no-bind')
    },

    messages: {
      bindCall: 'JSX props should not use .bind()',
      arrowFunc: 'JSX props should not use arrow functions',
      bindExpression: 'JSX props should not use ::',
      func: 'JSX props should not use functions'
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
        allowFunctions: {
          default: false,
          type: 'boolean'
        },
        ignoreRefs: {
          default: false,
          type: 'boolean'
        },
        ignoreDOMComponents: {
          default: false,
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: Components.detect((context) => {
    const configuration = context.options[0] || {};

    // Keep track of all the variable names pointing to a bind call,
    // bind expression or an arrow function in different block statements
    const blockVariableNameSets = {};

    const iteratorFunctionParamsStack = [];

    function setBlockVariableNameSet(blockStart) {
      blockVariableNameSets[blockStart] = {
        arrowFunc: new Set(),
        bindCall: new Set(),
        bindExpression: new Set(),
        func: new Set()
      };
    }

    function isUsingIteratorFunctionParams(args) {
      for (const arg of args) {
        for (const params of iteratorFunctionParamsStack) {
          for (const paramName of params) {
            if (paramName === arg.name) {
              return true;
            }
          }
        }
      }
      return false;
    }

    function getNodeViolationType(node, scope) {
      const nodeType = node.type;

      if (
        !configuration.allowBind
        && nodeType === 'CallExpression'
        && node.callee.type === 'MemberExpression'
        && node.callee.property.type === 'Identifier'
        && node.callee.property.name === 'bind'
      ) {
        if (isUsingIteratorFunctionParams(scope.variables)) {
          return null;
        }
        return 'bindCall';
      }
      if (nodeType === 'ConditionalExpression') {
        return getNodeViolationType(node.test, scope)
               || getNodeViolationType(node.consequent, scope)
               || getNodeViolationType(node.alternate, scope);
      }
      if (!configuration.allowArrowFunctions && nodeType === 'ArrowFunctionExpression') {
        if (isUsingIteratorFunctionParams(scope.variables)) {
          return null;
        }
        return 'arrowFunc';
      }
      if (!configuration.allowFunctions && nodeType === 'FunctionExpression') {
        if (isUsingIteratorFunctionParams(scope.variables)) {
          return null;
        }
        return 'func';
      }
      if (!configuration.allowBind && nodeType === 'BindExpression') {
        if (isUsingIteratorFunctionParams(scope.variables)) {
          return null;
        }
        return 'bindExpression';
      }

      return null;
    }

    function addVariableNameToSet(violationType, variableName, blockStart) {
      blockVariableNameSets[blockStart][violationType].add(variableName);
    }

    function getBlockStatementAncestors(node) {
      return context.getAncestors(node).reverse().filter(
        (ancestor) => ancestor.type === 'BlockStatement'
      );
    }

    function reportVariableViolation(node, name, blockStart) {
      const blockSets = blockVariableNameSets[blockStart];
      const violationTypes = Object.keys(blockSets);

      return violationTypes.find((type) => {
        if (blockSets[type].has(name)) {
          context.report({
            node,
            messageId: type
          });
          return true;
        }

        return false;
      });
    }

    function findVariableViolation(node, name) {
      getBlockStatementAncestors(node).find(
        (block) => reportVariableViolation(node, name, block.range[0])
      );
    }

    function getIteratorFunctionParams(node) {
      const callee = node.callee;
      if (
        (callee.type !== 'MemberExpression' && callee.type !== 'OptionalMemberExpression')
        || callee.property.type !== 'Identifier'
        || callee.property.name !== 'map'
        || callee.object.name === 'Children'
      ) {
        return null;
      }

      const callback = node.arguments[0];
      if (!callback) {
        return null;
      }

      if (!astUtil.isFunctionLikeExpression(callback)) {
        return null;
      }

      if (!callback.params) {
        return;
      }

      return callback.params.map((param) => param.name);
    }

    function popIteratorFunctionParams(node) {
      const params = getIteratorFunctionParams(node);
      if (!params) {
        return;
      }

      iteratorFunctionParamsStack.pop();
    }

    return {
      'CallExpression, OptionalCallExpression'(node) {
        const params = getIteratorFunctionParams(node);
        if (!params) {
          return;
        }

        iteratorFunctionParamsStack.push(params);
      },

      'CallExpression:exit': popIteratorFunctionParams,
      'OptionalCallExpression:exit': popIteratorFunctionParams,

      BlockStatement(node) {
        setBlockVariableNameSet(node.range[0]);
      },

      VariableDeclarator(node) {
        if (!node.init) {
          return;
        }

        const scope = context.getScope();
        const blockAncestors = getBlockStatementAncestors(node);
        const variableViolationType = getNodeViolationType(node.init, scope);

        if (
          blockAncestors.length > 0
          && variableViolationType
          && node.parent.kind === 'const' // only support const right now
        ) {
          addVariableNameToSet(
            variableViolationType, node.id.name, blockAncestors[0].range[0]
          );
        }
      },

      JSXAttribute(node) {
        const isRef = configuration.ignoreRefs && propName(node) === 'ref';
        if (isRef || !node.value || !node.value.expression) {
          return;
        }
        const isDOMComponent = jsxUtil.isDOMComponent(node.parent);
        if (configuration.ignoreDOMComponents && isDOMComponent) {
          return;
        }
        const valueNode = node.value.expression;
        const valueNodeType = valueNode.type;
        const scope = context.getScope();
        const nodeViolationType = getNodeViolationType(valueNode, scope);

        if (valueNodeType === 'Identifier') {
          findVariableViolation(node, valueNode.name);
        } else if (nodeViolationType) {
          context.report({
            node,
            messageId: nodeViolationType
          });
        }
      }
    };
  })
};
