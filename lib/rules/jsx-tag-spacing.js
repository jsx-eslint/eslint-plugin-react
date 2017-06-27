/**
 * @fileoverview Validates whitespace in and around the JSX opening and closing brackets
 * @author Diogo Franco (Kovensky)
 */
'use strict';

const has = require('has');
const getTokenBeforeClosingBracket = require('../util/getTokenBeforeClosingBracket');

// ------------------------------------------------------------------------------
// Validators
// ------------------------------------------------------------------------------

function validateClosingSlash(context, node, option) {
  const sourceCode = context.getSourceCode();

  const SELF_CLOSING_NEVER_MESSAGE = 'Whitespace is forbidden between `/` and `>`; write `/>`';
  const SELF_CLOSING_ALWAYS_MESSAGE = 'Whitespace is required between `/` and `>`; write `/ >`';
  const NEVER_MESSAGE = 'Whitespace is forbidden between `<` and `/`; write `</`';
  const ALWAYS_MESSAGE = 'Whitespace is required between `<` and `/`; write `< /`';

  let adjacent;

  if (node.selfClosing) {
    const lastTokens = sourceCode.getLastTokens(node, 2);

    adjacent = !sourceCode.isSpaceBetweenTokens(lastTokens[0], lastTokens[1]);

    if (option === 'never') {
      if (!adjacent) {
        context.report({
          node: node,
          loc: {
            start: lastTokens[0].loc.start,
            end: lastTokens[1].loc.end
          },
          message: SELF_CLOSING_NEVER_MESSAGE,
          fix: function(fixer) {
            return fixer.removeRange([lastTokens[0].range[1], lastTokens[1].range[0]]);
          }
        });
      }
    } else if (option === 'always' && adjacent) {
      context.report({
        node: node,
        loc: {
          start: lastTokens[0].loc.start,
          end: lastTokens[1].loc.end
        },
        message: SELF_CLOSING_ALWAYS_MESSAGE,
        fix: function(fixer) {
          return fixer.insertTextBefore(lastTokens[1], ' ');
        }
      });
    }
  } else {
    const firstTokens = sourceCode.getFirstTokens(node, 2);

    adjacent = !sourceCode.isSpaceBetweenTokens(firstTokens[0], firstTokens[1]);

    if (option === 'never') {
      if (!adjacent) {
        context.report({
          node: node,
          loc: {
            start: firstTokens[0].loc.start,
            end: firstTokens[1].loc.end
          },
          message: NEVER_MESSAGE,
          fix: function(fixer) {
            return fixer.removeRange([firstTokens[0].range[1], firstTokens[1].range[0]]);
          }
        });
      }
    } else if (option === 'always' && adjacent) {
      context.report({
        node: node,
        loc: {
          start: firstTokens[0].loc.start,
          end: firstTokens[1].loc.end
        },
        message: ALWAYS_MESSAGE,
        fix: function(fixer) {
          return fixer.insertTextBefore(firstTokens[1], ' ');
        }
      });
    }
  }
}

function validateBeforeSelfClosing(context, node, option) {
  const sourceCode = context.getSourceCode();

  const NEVER_MESSAGE = 'A space is forbidden before closing bracket';
  const ALWAYS_MESSAGE = 'A space is required before closing bracket';

  const leftToken = getTokenBeforeClosingBracket(node);
  const closingSlash = sourceCode.getTokenAfter(leftToken);

  if (leftToken.loc.end.line !== closingSlash.loc.start.line) {
    return;
  }

  if (option === 'always' && !sourceCode.isSpaceBetweenTokens(leftToken, closingSlash)) {
    context.report({
      node: node,
      loc: closingSlash.loc.start,
      message: ALWAYS_MESSAGE,
      fix: function(fixer) {
        return fixer.insertTextBefore(closingSlash, ' ');
      }
    });
  } else if (option === 'never' && sourceCode.isSpaceBetweenTokens(leftToken, closingSlash)) {
    context.report({
      node: node,
      loc: closingSlash.loc.start,
      message: NEVER_MESSAGE,
      fix: function(fixer) {
        const previousToken = sourceCode.getTokenBefore(closingSlash);
        return fixer.removeRange([previousToken.range[1], closingSlash.range[0]]);
      }
    });
  }
}

function validateAfterOpening(context, node, option) {
  const sourceCode = context.getSourceCode();

  const NEVER_MESSAGE = 'A space is forbidden after opening bracket';
  const ALWAYS_MESSAGE = 'A space is required after opening bracket';

  const openingToken = sourceCode.getTokenBefore(node.name);

  if (option === 'allow-multiline') {
    if (openingToken.loc.start.line !== node.name.loc.start.line) {
      return;
    }
  }

  const adjacent = !sourceCode.isSpaceBetweenTokens(openingToken, node.name);

  if (option === 'never' || option === 'allow-multiline') {
    if (!adjacent) {
      context.report({
        node: node,
        loc: {
          start: openingToken.loc.start,
          end: node.name.loc.start
        },
        message: NEVER_MESSAGE,
        fix: function(fixer) {
          return fixer.removeRange([openingToken.range[1], node.name.range[0]]);
        }
      });
    }
  } else if (option === 'always' && adjacent) {
    context.report({
      node: node,
      loc: {
        start: openingToken.loc.start,
        end: node.name.loc.start
      },
      message: ALWAYS_MESSAGE,
      fix: function(fixer) {
        return fixer.insertTextBefore(node.name, ' ');
      }
    });
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {},
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          closingSlash: {
            enum: ['always', 'never', 'allow']
          },
          beforeSelfClosing: {
            enum: ['always', 'never', 'allow']
          },
          afterOpening: {
            enum: ['always', 'allow-multiline', 'never', 'allow']
          }
        },
        default: {
          closingSlash: 'never',
          beforeSelfClosing: 'always',
          afterOpening: 'never'
        },
        additionalProperties: false
      }
    ]
  },
  create: function (context) {
    const options = {
      closingSlash: 'never',
      beforeSelfClosing: 'always',
      afterOpening: 'never'
    };
    for (const key in options) {
      if (has(options, key) && has(context.options[0] || {}, key)) {
        options[key] = context.options[0][key];
      }
    }

    return {
      JSXOpeningElement: function (node) {
        if (options.closingSlash !== 'allow' && node.selfClosing) {
          validateClosingSlash(context, node, options.closingSlash);
        }
        if (options.afterOpening !== 'allow') {
          validateAfterOpening(context, node, options.afterOpening);
        }
        if (options.beforeSelfClosing !== 'allow' && node.selfClosing) {
          validateBeforeSelfClosing(context, node, options.beforeSelfClosing);
        }
      },
      JSXClosingElement: function (node) {
        if (options.afterOpening !== 'allow') {
          validateAfterOpening(context, node, options.afterOpening);
        }
        if (options.closingSlash !== 'allow') {
          validateClosingSlash(context, node, options.closingSlash);
        }
      }
    };
  }
};
