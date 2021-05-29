/**
 * @fileoverview Prevents usage of Function.prototype.bind and arrow functions
 *               in React component props.
 * @author Daniel Lo Nigro <dan.cx>
 * @author Jacky Ho
 */

'use strict';

const entries = require('object.entries');
const propName = require('jsx-ast-utils/propName');
const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const jsxUtil = require('../util/jsx');

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

    function setBlockVariableNameSet(blockStart) {
      blockVariableNameSets[blockStart] = {
        arrowFunc: new Set(),
        bindCall: new Set(),
        bindExpression: new Set(),
        func: new Set()
      };
    }

    function getNodeViolationType(node) {
      const nodeType = node.type;

      if (
        !configuration.allowBind
        && nodeType === 'CallExpression'
        && node.callee.type === 'MemberExpression'
        && node.callee.property.type === 'Identifier'
        && node.callee.property.name === 'bind'
      ) {
        return 'bindCall';
      }
      if (nodeType === 'ConditionalExpression') {
        return getNodeViolationType(node.test)
               || getNodeViolationType(node.consequent)
               || getNodeViolationType(node.alternate);
      }
      if (!configuration.allowArrowFunctions && nodeType === 'ArrowFunctionExpression') {
        return 'arrowFunc';
      }
      if (!configuration.allowFunctions && nodeType === 'FunctionExpression') {
        return 'func';
      }
      if (!configuration.allowBind && nodeType === 'BindExpression') {
        return 'bindExpression';
      }

      return null;
    }

    function addVariableNameToSet(violationType, variableName, blockStart) {
      blockVariableNameSets[blockStart][violationType].add(variableName);
    }

    function onlyBlockStatements(ancestor) {
      return ancestor.type === 'BlockStatement';
    }

    function getBlockStatementAncestors(node) {
      return context.getAncestors(node).filter(onlyBlockStatements).reverse();
    }

    function reportVariableViolation(node, name, blockStart) {
      const blockSets = blockVariableNameSets[blockStart];
      const violationTypes = entries(blockSets);

      const foundTypeEntry = violationTypes.find((typeEntry) => {
        if (typeEntry[1].has(name)) {
          return true;
        }

        return false;
      });

      if (foundTypeEntry) {
        context.report({
          node,
          messageId: foundTypeEntry[0]
        });
      }

      return foundTypeEntry;
    }

    function findVariableViolation(node, name) {
      getBlockStatementAncestors(node).find(
        (block) => reportVariableViolation(node, name, block.range[0])
      );
    }

    return {
      BlockStatement(node) {
        setBlockVariableNameSet(node.range[0]);
      },

      VariableDeclarator(node) {
        if (!node.init) {
          return;
        }

        // only support const right now
        if (node.parent.kind === 'const') {
          const blockAncestors = getBlockStatementAncestors(node);
          const variableViolationType = getNodeViolationType(node.init);

          if (
            blockAncestors.length > 0
            && variableViolationType
          ) {
            addVariableNameToSet(
              variableViolationType, node.id.name, blockAncestors[0].range[0]
            );
          }
        }
      },

      JSXAttribute(node) {
        if (!node.value || !node.value.expression || (configuration.ignoreRefs && propName(node) === 'ref')) {
          return;
        }
        if (configuration.ignoreDOMComponents && jsxUtil.isDOMComponent(node.parent)) {
          return;
        }
        const valueNode = node.value.expression;
        const valueNodeType = valueNode.type;

        if (valueNodeType === 'Identifier') {
          findVariableViolation(node, valueNode.name);
        } else {
          const nodeViolationType = getNodeViolationType(valueNode);
          if (nodeViolationType) {
            context.report({
              node,
              messageId: nodeViolationType
            });
          }
        }
      }
    };
  })
};
