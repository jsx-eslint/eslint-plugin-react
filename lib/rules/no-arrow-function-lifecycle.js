/**
 * @fileoverview Lifecycle methods should be methods on the prototype, not class fields
 * @author Tan Nguyen
 */

'use strict';

const values = require('object.values');

const Components = require('../util/Components');
const astUtil = require('../util/ast');
const componentUtil = require('../util/componentUtil');
const docsUrl = require('../util/docsUrl');
const lifecycleMethods = require('../util/lifecycleMethods');
const report = require('../util/report');
const eslintUtil = require('../util/eslint');

const getCommentsAfter = eslintUtil.getCommentsAfter;
const getCommentsBefore = eslintUtil.getCommentsBefore;
const getSourceCode = eslintUtil.getSourceCode;
const getText = eslintUtil.getText;

function getRuleText(node) {
  const params = node.value.params.map((p) => p.name);

  if (node.type === 'Property') {
    return `: function(${params.join(', ')}) `;
  }

  if (node.type === 'ClassProperty' || node.type === 'PropertyDefinition') {
    return `(${params.join(', ')}) `;
  }

  return null;
}

// a comment that ends its line: a line comment, or a block comment containing a line break
function endsLine(context, comment) {
  return comment.type === 'Line' || /[\r\n\u2028\u2029]/.test(getText(context, comment));
}

/**
 * Build the `{ return ...; }` block that replaces an arrow function's expression body
 * @param {Object} context The rule context
 * @param {ASTNode} node The property whose value is the arrow function
 * @param {Array} previousComment The comments before the body
 * @param {ASTNode} body The expression body
 * @param {Array} nextComment The comments after the body
 * @returns {string} The block's text
 */
function getReturnBlockText(context, node, previousComment, body, nextComment) {
  const indent = /^\s*/.exec(getSourceCode(context).lines[node.loc.start.line - 1])[0];
  const commentsText = (comments) => comments.map((x) => getText(context, x)).join('');
  const bodyText = getText(context, body);

  // a line break between `return` and its expression would return `undefined`, so such comments go before it
  const before = previousComment.some((x) => endsLine(context, x))
    ? `{ ${previousComment.map((x) => `${getText(context, x)}${x.type === 'Line' ? `\n${indent}` : ' '}`).join('')}return ${bodyText}`
    : `{ return ${commentsText(previousComment)}${bodyText}`;

  // a line comment would comment out the rest of the line, so end it with a line break
  return nextComment.some((x) => endsLine(context, x))
    ? `${before}; ${commentsText(nextComment)}\n${indent}}`
    : `${before}${commentsText(nextComment)}; }`;
}

const messages = {
  lifecycle: '{{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Lifecycle methods should be methods on the prototype, not class fields',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-arrow-function-lifecycle'),
    },
    messages,
    schema: [],
    fixable: 'code',
  },

  create: Components.detect((context, components) => {
    /**
     * @param {Array} properties list of component properties
     */
    function reportNoArrowFunctionLifecycle(properties) {
      properties.forEach((node) => {
        if (!node || !node.value) {
          return;
        }

        const propertyName = astUtil.getPropertyName(node);
        const nodeType = node.value.type;
        const isLifecycleMethod = (
          node.static && !componentUtil.isES5Component(node, context)
            ? lifecycleMethods.static
            : lifecycleMethods.instance
        ).indexOf(propertyName) > -1;

        if (nodeType === 'ArrowFunctionExpression' && isLifecycleMethod) {
          const body = node.value.body;
          const isBlockBody = body.type === 'BlockStatement';
          const sourceCode = getSourceCode(context);

          let nextComment = [];
          let previousComment = [];
          let bodyRange;
          if (!isBlockBody) {
            previousComment = getCommentsBefore(context, body);
            nextComment = getCommentsAfter(context, body);
            bodyRange = [
              (previousComment.length > 0 ? previousComment[0] : body).range[0],
              (nextComment.length > 0 ? nextComment[nextComment.length - 1] : body).range[1]
                + (node.value.body.type === 'ObjectExpression' ? 1 : 0), // to account for a wrapped end paren
            ];
          }
          const headRange = [
            node.key.range[1],
            (previousComment.length > 0 ? previousComment[0] : body).range[0],
          ];
          const hasSemi = node.value.expression && getText(context, node).slice(node.value.range[1] - node.range[0]) === ';';

          report(
            context,
            messages.lifecycle,
            'lifecycle',
            {
              node,
              data: {
                propertyName,
              },
              fix(fixer) {
                if (!sourceCode.getCommentsAfter) {
                  // eslint 3.x
                  return isBlockBody && fixer.replaceTextRange(headRange, getRuleText(node));
                }
                return [].concat(
                  fixer.replaceTextRange(headRange, getRuleText(node)),
                  isBlockBody ? [] : fixer.replaceTextRange(
                    [bodyRange[0], bodyRange[1] + (hasSemi ? 1 : 0)],
                    getReturnBlockText(context, node, previousComment, body, nextComment)
                  )
                );
              },
            }
          );
        }
      });
    }

    return {
      'Program:exit'() {
        values(components.list()).forEach((component) => {
          const properties = astUtil.getComponentProperties(component.node);
          reportNoArrowFunctionLifecycle(properties);
        });
      },
    };
  }),
};
