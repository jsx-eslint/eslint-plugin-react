/**
 * @fileoverview Do not initialise useState with undefined
 * @author https://github.com/hjoelh
 */

'use strict';

const report = require('../util/report');
const docsUrl = require('../util/docsUrl');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function isCalledWithUndefined(node) {
  if (node.arguments.length === 0) return true;

  if (
    node.arguments[0].type === 'Identifier'
    && node.arguments[0].name === 'undefined'
  ) {
    return true;
  }
}

function isHook(node) {
  if (node.type === 'Identifier') {
    return node.name === 'useState';
  }
  if (
    node.type === 'MemberExpression'
    && !node.computed
    && isHook(node.property)
  ) {
    const obj = node.object;
    const isPascalCaseNameSpace = /^[A-Z].*/;
    return obj.type === 'Identifier' && isPascalCaseNameSpace.test(obj.name);
  }
}

const messages = {
  noUndefinedInitialState: 'Do not initialise useState with undefined',
};

module.exports = {
  meta: {
    docs: {
      type: 'suggestion',
      description: 'Do not initialise useState with undefined',
      recommended: false,
      url: docsUrl('no-undefined-initial-state'),
    },
    messages,
  },
  create(context) {
    return {
      CallExpression(node) {
        if (isHook(node.callee) && isCalledWithUndefined(node)) {
          report(
            context,
            messages.noUndefinedInitialState,
            'noUndefinedInitialState',
            node
          );
        }
      },
    };
  },
};
