/**
 * @fileoverview Limit to one element tag per line in JSX
 * @author Mark Allen
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

    function generateFixFunction(elementInLine) {
      const nodeText = sourceCode.getText(elementInLine);

      return function(fixer) {
        return fixer.replaceText(elementInLine, `\n${nodeText}`);
      };
    }

    return {
      JSXOpeningElement: function (node) {
        if (!node.parent) {
          return;
        }

        const openingElementEndLine = node.loc.end.line;

        // Children
        if (node.parent.children.length) {
          const childrenOnLine = [];

          node.parent.children.forEach(childNode => {
            if (!childNode.openingElement || childNode.openingElement.loc.start.line !== openingElementEndLine) {
              return;
            }

            childrenOnLine.push(childNode);
          });

          if (!childrenOnLine.length) {
            return;
          }

          childrenOnLine.forEach(elementInLine => {
            context.report({
              node: elementInLine,
              message: `Opening tag for Element \`${elementInLine.openingElement.name.name}\` must be placed on a new line`,
              fix: generateFixFunction(elementInLine)
            });
          });
        }

        // Siblings
        if (node.parent.parent && node.parent.parent.children && node.parent.parent.children.length) {
          const firstSibling = node.parent.parent.children.find(sibling => sibling.type === 'JSXElement');

          if (firstSibling === node.parent) {
            return;
          }

          context.report({
            node: node,
            message: `Opening tag for Element \`${node.name.name}\` must be placed on a new line`,
            fix: generateFixFunction(node)
          });
        }
      },

      JSXClosingElement: function (node) {
        if (!node.parent || !node.parent.children.length) {
          return;
        }

        const childrenOnLine = [];
        const closingElementStartLine = node.loc.end.line;

        node.parent.children.forEach(childNode => {
          const reportableLines = [childNode.openingElement, childNode.closingElement].reduce((lines, el) => {
            if (!el) {
              return lines;
            }

            return lines.concat([el.loc.start.line, el.loc.end.line]);
          }, []);

          if (reportableLines.indexOf(closingElementStartLine) === -1) {
            return;
          }

          childrenOnLine.push(childNode);
        });

        if (!childrenOnLine.length) {
          return;
        }

        context.report({
          node: node,
          message: `Closing tag for Element \`${node.name.name}\` must be placed on a new line`,
          fix: generateFixFunction(node)
        });
      }
    };
  }
};
