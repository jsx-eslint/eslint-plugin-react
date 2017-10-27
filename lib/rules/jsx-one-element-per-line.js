/**
 * @fileoverview Limit to one element tag per line in JSX
 * @author Mark Ivan Allen <Vydia.com>
 */

'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Limit to one element tag per line in JSX',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'whitespace',
    schema: []
  },

  create: function (context) {
    const sourceCode = context.getSourceCode();

    return {
      JSXElement: function (node) {
        const children = node.children;

        if (!children || !children.length) {
          return;
        }

        const openingElement = node.openingElement;
        const closingElement = node.closingElement;
        const openingElementEndLine = openingElement.loc.end.line;
        const closingElementStartLine = closingElement.loc.start.line;

        const childrenGroupedByLine = {};

        children.forEach(child => {
          let countNewLinesBeforeContent = 0;
          let countNewLinesAfterContent = 0;

          if (child.type === 'Literal') {
            if (child.value.match(/^\s*$/)) {
              return;
            }

            countNewLinesBeforeContent = (child.raw.match(/^ *\n/g) || []).length;
            countNewLinesAfterContent = (child.raw.match(/\n *$/g) || []).length;
          }

          const startLine = child.loc.start.line + countNewLinesBeforeContent;
          const endLine = child.loc.end.line - countNewLinesAfterContent;

          if (startLine === endLine) {
            if (!childrenGroupedByLine[startLine]) {
              childrenGroupedByLine[startLine] = [];
            }
            childrenGroupedByLine[startLine].push(child);
          } else {
            if (!childrenGroupedByLine[startLine]) {
              childrenGroupedByLine[startLine] = [];
            }
            childrenGroupedByLine[startLine].push(child);
            if (!childrenGroupedByLine[endLine]) {
              childrenGroupedByLine[endLine] = [];
            }
            childrenGroupedByLine[endLine].push(child);
          }
        });

        Object.keys(childrenGroupedByLine).forEach(line => {
          line = parseInt(line, 10);
          const firstIndex = 0;
          const lastIndex = childrenGroupedByLine[line].length - 1;

          childrenGroupedByLine[line].forEach((child, i) => {
            let prevChild;
            if (i === firstIndex) {
              if (line === openingElementEndLine) {
                prevChild = openingElement;
              }
            } else {
              prevChild = childrenGroupedByLine[line][i - 1];
            }
            let nextChild;
            if (i === lastIndex) {
              if (line === closingElementStartLine) {
                nextChild = closingElement;
              }
            } else {
              // We don't need to append a trailing because the next child will prepend a leading.
              // nextChild = childrenGroupedByLine[line][i + 1];
            }

            function spaceBetweenPrev () {
              return (prevChild.type === 'Literal' && prevChild.raw.match(/ $/)) ||
                (child.type === 'Literal' && child.raw.match(/^ /)) ||
                sourceCode.isSpaceBetweenTokens(prevChild, child);
            }
            function spaceBetweenNext () {
              return (nextChild.type === 'Literal' && nextChild.raw.match(/^ /)) ||
                (child.type === 'Literal' && child.raw.match(/ $/)) ||
                sourceCode.isSpaceBetweenTokens(child, nextChild);
            }
            const leadingSpace = prevChild && spaceBetweenPrev() ? '\n{\' \'}' : '';
            const trailingSpace = nextChild && spaceBetweenNext() ? '{\' \'}\n' : '';
            const leadingNewLine = prevChild ? '\n' : '';
            const trailingNewLine = nextChild ? '\n' : '';

            if (!prevChild && !nextChild) {
              return;
            }

            const source = sourceCode.getText(child);

            function nodeDescriptor (n) {
              return n.openingElement ? n.openingElement.name.name : source.replace(/\n/g, '');
            }

            context.report({
              node: child,
              message: `\`${nodeDescriptor(child)}\` must be placed on a new line`,
              fix: function (fixer) {
                return fixer.replaceText(child, `${leadingSpace}${leadingNewLine}${source}${trailingNewLine}${trailingSpace}`);
              }
            });
          });
        });
      }
    };
  }
};
