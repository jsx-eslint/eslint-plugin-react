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

// the arrow function's type parameters, parameters, and return type, as written
function getSignatureText(context, node) {
  const fn = node.value;
  const params = fn.params.length > 0
    ? getText(context).slice(fn.params[0].range[0], fn.params[fn.params.length - 1].range[1])
    : '';
  const typeParameters = fn.typeParameters ? getText(context, fn.typeParameters) : '';
  const returnType = fn.returnType ? getText(context, fn.returnType) : '';
  return `${typeParameters}(${params})${returnType}`;
}

function getRuleText(context, node) {
  if (node.type === 'Property') {
    return `: ${node.value.async ? 'async ' : ''}function${getSignatureText(context, node)} `;
  }

  if (node.type === 'ClassProperty' || node.type === 'PropertyDefinition') {
    return `${getSignatureText(context, node)} `;
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
          // a computed key's closing bracket is part of the key
          const keyStart = node.computed ? sourceCode.getTokenBefore(node.key).range[0] : node.key.range[0];
          const keyEnd = node.computed ? sourceCode.getTokenAfter(node.key).range[1] : node.key.range[1];
          // an async class method needs `async` before its name
          const isAsyncClassMethod = node.value.async && node.type !== 'Property';
          const headRange = [
            isAsyncClassMethod ? keyStart : keyEnd,
            (previousComment.length > 0 ? previousComment[0] : body).range[0],
          ];
          const headText = `${isAsyncClassMethod ? `async ${getText(context).slice(keyStart, keyEnd)}` : ''}${getRuleText(context, node)}`;

          // parens around the arrow function itself are removed with the head, so their closing parens must go too
          const tokensBeforeArrow = sourceCode.getTokensBetween(node.key, node.value);
          const arrowParens = tokensBeforeArrow.filter((token) => token.value === '(').length
            - tokensBeforeArrow.filter((token) => token.value === ')').length;
          let lastArrowToken = sourceCode.getLastToken(node.value);
          for (let i = 0; i < arrowParens; i += 1) {
            lastArrowToken = sourceCode.getTokenAfter(lastArrowToken);
          }
          const arrowEnd = lastArrowToken.range[1];
          if (arrowParens > 0 && !isBlockBody) {
            bodyRange[1] = Math.max(bodyRange[1], arrowEnd);
          }

          const hasSemi = node.value.expression && getText(context, node).slice(arrowEnd - node.range[0]) === ';';

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
                if (isBlockBody && arrowParens > 0) {
                  return fixer.replaceTextRange([headRange[0], arrowEnd], `${headText}${getText(context, body)}`);
                }
                if (!sourceCode.getCommentsAfter) {
                  // eslint 3.x
                  return isBlockBody && fixer.replaceTextRange(headRange, headText);
                }
                return [].concat(
                  fixer.replaceTextRange(headRange, headText),
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
