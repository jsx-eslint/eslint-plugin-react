/**
 * @fileoverview Report missing `key` props in iterators/collection literals.
 * @author Ben Mosher
 */

'use strict';

const hasProp = require('jsx-ast-utils/hasProp');
const getPropValue = require('jsx-ast-utils/getPropValue');
const getProp = require('jsx-ast-utils/getProp');
const docsUrl = require('../util/docsUrl');
const pragmaUtil = require('../util/pragma');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const defaultOptions = {
  checkFragmentShorthand: false,
  checkUniquePropKey: true
};

module.exports = {
  meta: {
    docs: {
      description: 'Report missing `key` props in iterators/collection literals',
      category: 'Possible Errors',
      recommended: true,
      url: docsUrl('jsx-key')
    },
    messages: {
      keyUnique: '"key" prop must be unique'
    },
    schema: [{
      type: 'object',
      properties: {
        checkFragmentShorthand: {
          type: 'boolean',
          default: defaultOptions.checkFragmentShorthand
        },
        checkUniquePropKey: {
          type: 'boolean',
          default: defaultOptions.checkUniquePropKey
        }
      },
      additionalProperties: false
    }]
  },

  create(context) {
    const options = Object.assign({}, defaultOptions, context.options[0]);
    const checkFragmentShorthand = options.checkFragmentShorthand;
    const checkUniquePropKey = options.checkUniquePropKey;
    const reactPragma = pragmaUtil.getFromContext(context);
    const fragmentPragma = pragmaUtil.getFragmentFromContext(context);
    const processedNodes = new Set();

    function checkIteratorElement(node) {
      if (node.type === 'JSXElement' && !hasProp(node.openingElement.attributes, 'key')) {
        context.report({
          node,
          message: 'Missing "key" prop for element in iterator'
        });
      } else if (checkFragmentShorthand && node.type === 'JSXFragment') {
        context.report({
          node,
          message: `Missing "key" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use ${reactPragma}.${fragmentPragma} instead`
        });
      }
    }

    function getReturnStatement(body) {
      return body.filter((item) => item.type === 'ReturnStatement')[0];
    }

    function nodeProcessed(node) {
      if (processedNodes.has(node)) {
        return true;
      }

      processedNodes.add(node);
      return false;
    }

    function reportMissingPropKey(nodes) {
      nodes.forEach((node) => {
        if (!hasProp(node.openingElement.attributes, 'key')) {
          context.report({
            node,
            message: 'Missing "key" prop for element in array'
          });
        }
      });
    }

    function reportNoUniquePropKey(nodes) {
      const uniqueKeys = new Set();

      nodes.forEach((node) => {
        if (node.type === 'JSXElement') {
          const keyNode = getProp(node.openingElement.attributes, 'key');
          if (keyNode) {
            const propKeyValue = getPropValue(keyNode);
            if (uniqueKeys.has(propKeyValue)) {
              context.report({
                node: keyNode,
                messageId: 'keyUnique'
              });
            } else {
              uniqueKeys.add(propKeyValue);
            }
          }
        }
      });
    }

    return {
      'ArrayExpression > JSXElement'(node) {
        if (!nodeProcessed(node.parent)) {
          reportMissingPropKey(node.parent.elements);
          if (checkUniquePropKey) {
            reportNoUniquePropKey(node.parent.elements);
          }
        }
      },

      'JSXElement > JSXElement'(node) {
        if (checkUniquePropKey && !nodeProcessed(node.parent)) {
          reportNoUniquePropKey(node.parent.children);
        }
      },

      JSXFragment(node) {
        if (!checkFragmentShorthand) {
          return;
        }

        if (node.parent.type === 'ArrayExpression') {
          context.report({
            node,
            message: `Missing "key" prop for element in array. Shorthand fragment syntax does not support providing keys. Use ${reactPragma}.${fragmentPragma} instead`
          });
        }
      },

      // Array.prototype.map
      'CallExpression, OptionalCallExpression'(node) {
        if (node.callee && node.callee.type !== 'MemberExpression' && node.callee.type !== 'OptionalMemberExpression') {
          return;
        }

        if (node.callee && node.callee.property && node.callee.property.name !== 'map') {
          return;
        }

        const fn = node.arguments[0];
        const isFn = fn && fn.type === 'FunctionExpression';
        const isArrFn = fn && fn.type === 'ArrowFunctionExpression';

        if (isArrFn && (fn.body.type === 'JSXElement' || fn.body.type === 'JSXFragment')) {
          checkIteratorElement(fn.body);
        }

        if (isFn || isArrFn) {
          if (fn.body.type === 'BlockStatement') {
            const returnStatement = getReturnStatement(fn.body.body);
            if (returnStatement && returnStatement.argument) {
              checkIteratorElement(returnStatement.argument);
            }
          }
        }
      }
    };
  }
};
