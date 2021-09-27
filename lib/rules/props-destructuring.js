/**
 * @fileoverview Forbid multiline props destructuring at Component declaration
 * @author Dragoș Străinu (@strdr4605)
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  noMultilinePropsDestructuring:
    "No multiple lines props destructuring at Component declaration, use 'props' parameter and destructure in function block"
};

module.exports = {
  meta: {
    docs: {
      description:
        'Forbid multiline props destructuring at Component declaration',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('props-destructuring')
    },

    messages,

    schema: []
  },

  create(context) {
    function checkPropsDestructuring(node) {
      const functionName = node.type === 'FunctionDeclaration' ? node.id.name : node.parent.id.name;

      if (functionName[0] !== functionName[0].toUpperCase()) {
        // Not a React Component
        return;
      }

      const firstParam = node.params[0];

      if (firstParam.type === 'ObjectPattern' && firstParam.loc.start.line !== firstParam.loc.end.line) {
        report(context, messages.noMultilinePropsDestructuring, 'noMultilinePropsDestructuring', {
          node,
          loc: {
            start: {
              line: firstParam.loc.start.line,
              column: firstParam.loc.start.column
            },
            end: {
              line: firstParam.loc.end.line,
              column: firstParam.loc.end.column
            }
          }
        });
      }
    }

    return {
      'FunctionDeclaration[params.length>0]': checkPropsDestructuring,
      'ArrowFunctionExpression[params.length>0]': checkPropsDestructuring
    };
  }
};
