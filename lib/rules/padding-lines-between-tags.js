/**
 * @fileoverview Enforce no padding lines between tags for React Components
 * @author Alankar Anand
 * Based on https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/padding-line-between-tags.js
 * https://github.com/jsx-eslint/eslint-plugin-react/issues/3554
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const report = require('../util/report');
const eslintUtil = require('../util/eslint');

/**
 * Split the source code into multiple lines based on the line delimiters.
 * Copied from padding-line-between-blocks
 * @param {string} text Source code as a string.
 * @returns {string[]} Array of source code lines.
 */

function splitLines(text) {
  return text.split(/\r\n|[\r\n\u2028\u2029]/gu);
}

function insertNewLine(tag, sibling, lineDifference) {
  const endTag = tag.closingElement || tag.openingElement;

  if (lineDifference === 1) {
    report({
      message: 'Unexpected blank line before {{endTag}}.',
      loc: sibling && sibling.loc,
      // @ts-ignore
      fix(fixer) {
        return fixer.insertTextAfter(tag, '\n');
      },
    });
  } else if (lineDifference === 0) {
    report({
      message: 'Expected blank line before {{endTag}}.',
      loc: sibling && sibling.loc,
      // @ts-ignore
      fix(fixer) {
        const lastSpaces = /** @type {RegExpExecArray} */ (
          /^\s*/.exec(eslintUtil.getSourceCode().lines[endTag.loc.start.line - 1])
        )[0];

        return fixer.insertTextAfter(endTag, `\n\n${lastSpaces}`);
      },
    });
  }
}

function removeExcessLines(endTag, sibling, lineDifference) {
  if (lineDifference > 1) {
    let hasOnlyTextBetween = true;
    for (
      let i = endTag.loc && endTag.loc.start.line;
      i < sibling.loc.start.line - 1 && hasOnlyTextBetween;
      i++
    ) {
      hasOnlyTextBetween = !/^\s*$/.test(eslintUtil.getSourceCode().lines[i]);
    }
    if (!hasOnlyTextBetween) {
      report({
        messageId: 'never',
        loc: sibling && sibling.loc,
        // @ts-ignore
        fix(fixer) {
          const start = endTag.range[1];
          const end = sibling.range[0];
          const paddingText = eslintUtil.getSourceCode().text.slice(start, end);
          const textBetween = splitLines(paddingText);
          let newTextBetween = `\n${textBetween.pop()}`;
          for (let i = textBetween.length - 1; i >= 0; i--) {
            if (!/^\s*$/.test(textBetween[i])) {
              newTextBetween = `${i === 0 ? '' : '\n'}${
                textBetween[i]
              }${newTextBetween}`;
            }
          }
          return fixer.replaceTextRange([start, end], `${newTextBetween}`);
        },
      });
    }
  }
}

function checkNewLine(configureList) {
  const firstConsistentBlankLines = new Map();

  const reverseConfigureList = [...configureList].reverse();

  return (node) => {
    if (!node.parent.parent) {
      return;
    }

    const endTag = node.closingElement || node.openingElement;

    if (!node.parent.children) {
      return;
    }
    const lowerSiblings = node.parent.children
      .filter(
        (element) => element.type === 'JSXElement' && element.range !== node.range
      )
      .filter((sibling) => sibling.range[0] - endTag.range[1] >= 0);

    if (lowerSiblings.length === 0) {
      return;
    }
    const closestSibling = lowerSiblings[0];

    const lineDifference = closestSibling.loc.start.line - endTag.loc.end.line;

    const configure = reverseConfigureList.find(
      (config) => (config.prev === '*'
          || node.openingElement.name.name === config.prev)
        && (config.next === '*'
          || closestSibling.openingElement.name.name === config.next)
    );

    if (!configure) {
      return;
    }

    let blankLine = configure.blankLine;

    if (blankLine === 'consistent') {
      const firstConsistentBlankLine = firstConsistentBlankLines.get(
        node.parent
      );
      if (firstConsistentBlankLine == null) {
        firstConsistentBlankLines.set(
          node.parent,
          lineDifference > 1 ? 'always' : 'never'
        );
        return;
      }
      blankLine = firstConsistentBlankLine;
    }

    if (blankLine === 'always') {
      insertNewLine(node, closestSibling, lineDifference);
    } else {
      removeExcessLines(endTag, closestSibling, lineDifference);
    }
  };
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  // eslint-disable-next-line eslint-plugin/prefer-message-ids
  meta: {
    docs: {
      description: 'Enforce no padding lines between tags for React Components',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('padding-lines-between-tags'),
    },
    fixable: 'code',
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            blankLine: { enum: ['always', 'never', 'consistent'] },
            prev: { type: 'string' },
            next: { type: 'string' },
          },
          additionalProperties: false,
          required: ['blankLine', 'prev', 'next'],
        },
      },
    ],
  },

  create(context) {
    const configureList = context.options[0] || [
      { blankLine: 'always', prev: '*', next: '*' },
    ];
    return {
      JSXElement: checkNewLine(configureList),
    };
  },
};
