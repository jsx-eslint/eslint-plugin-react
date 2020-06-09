/**
 * @fileoverview Report missing `key` props in iterators/collection literals.
 * @author Ben Mosher
 */

'use strict';

const hasProp = require('jsx-ast-utils/hasProp');
const docsUrl = require('../util/docsUrl');
const pragmaUtil = require('../util/pragma');


// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const defaultOptions = {
  checkFragmentShorthand: false,
  allowSpreadKeys: true // TODO: When React separates keys from props this should become false
};

module.exports = {
  meta: {
    docs: {
      description: 'Report missing `key` props in iterators/collection literals',
      category: 'Possible Errors',
      recommended: true,
      url: docsUrl('jsx-key')
    },
    schema: [{
      type: 'object',
      properties: {
        checkFragmentShorthand: {
          type: 'boolean',
          default: defaultOptions.checkFragmentShorthand
        },
        allowSpreadKeys: {
          type: 'boolean',
          default: defaultOptions.allowSpreadKeys
        }
      },
      additionalProperties: false
    }]
  },

  create(context) {
    const options = Object.assign({}, defaultOptions, context.options[0]);
    const checkFragmentShorthand = options.checkFragmentShorthand;
    const allowSpreadKeys = options.allowSpreadKeys;
    const reactPragma = pragmaUtil.getFromContext(context);
    const fragmentPragma = pragmaUtil.getFragmentFromContext(context);

    function checkIteratorElement(node) {
      if (node.type === 'JSXElement') {
        const hasAKeyAttribute = hasProp(node.openingElement.attributes, 'key');

        const hasASpreadArgumentWithAKeyProperty = allowSpreadKeys && node.openingElement
          && node.openingElement.attributes
          && node.openingElement.attributes.some(
            ({argument}) => argument && argument.properties && argument.properties.some(
              (property) => property.key.name === 'key'));

        const hasAnObjectSpreadArgument = allowSpreadKeys && node.openingElement
          && node.openingElement.attributes
          && node.openingElement.attributes.some(
            ({argument}) => argument && argument.type === 'Identifier');

        const isValidElement = hasAKeyAttribute
         || hasASpreadArgumentWithAKeyProperty
         || hasAnObjectSpreadArgument;
        if (isValidElement) return;

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

    return {
      JSXElement(node) {
        if (hasProp(node.openingElement.attributes, 'key')) {
          return;
        }

        if (node.parent.type === 'ArrayExpression') {
          context.report({
            node,
            message: 'Missing "key" prop for element in array'
          });
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
