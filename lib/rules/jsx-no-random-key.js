/**
 * @fileoverview  Prevent usage of random value for `key` prop.
 * @author Pavel Pustovalov
 */

'use strict';

const hasProp = require('jsx-ast-utils/hasProp');
const getPropValue = require('jsx-ast-utils/getPropValue');
const getProp = require('jsx-ast-utils/getProp');
const docsUrl = require('../util/docsUrl');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const FORBIDDEN_KEY_VALUES = [
  'cuid',
  'Math',
  'nanoid',
  'short',
  'shortid',
  'slugid',
  'uuidv1',
  'uuidv3',
  'uuidv4',
  'uuidv5'
];

const ERROR_MESSAGE = 'Don\'t use random value for "key" prop';

module.exports = {
  meta: {
    docs: {
      description: 'Prevent usage of random value for `key` prop',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('jsx-no-random-key')
    },
    schema: []
  },

  create(context) {
    function checkIteratorElement(node) {
      if (
        node.type === 'JSXElement'
        && hasProp(node.openingElement.attributes, 'key')
      ) {
        const keyProp = getProp(node.openingElement.attributes, 'key');
        const keyValue = getPropValue(keyProp);

        if (keyProp.value.expression.type === 'CallExpression' && FORBIDDEN_KEY_VALUES.some((v) => keyValue.includes(v))) {
          context.report({
            node,
            message: ERROR_MESSAGE
          });
        }
      }
    }

    function getReturnStatement(body) {
      return body.filter((item) => item.type === 'ReturnStatement')[0];
    }

    return {
      JSXElement(node) {
        if (!hasProp(node.openingElement.attributes, 'key')) {
          return;
        }

        const keyProp = getProp(node.openingElement.attributes, 'key');
        const keyValue = getPropValue(keyProp);

        if (
          node.parent.type === 'ArrayExpression'
          && keyProp.value.expression.type === 'CallExpression'
          && typeof keyValue === 'string'
          && FORBIDDEN_KEY_VALUES.some((v) => keyValue.includes(v))
        ) {
          context.report({
            node,
            message: ERROR_MESSAGE
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
