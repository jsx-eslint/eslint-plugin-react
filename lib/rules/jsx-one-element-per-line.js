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

    function generateFixFunction(elementInLine) {
      const nodeText = sourceCode.getText(elementInLine);

      return function(fixer) {
        return fixer.replaceText(elementInLine, `\n${nodeText}`);
      };
    }

    function elementDoesOpenOrCloseOnLine (element, line) {
      const reportableLines = [element.openingElement, element.closingElement].reduce((lines, el) => {
        if (!el) {
          return lines;
        }

        return lines.concat([el.loc.start.line, el.loc.end.line]);
      }, []);


      return reportableLines.indexOf(line) !== -1;
    }

    function anyElementDoesOpenOrCloseOnLine (elements, line) {
      return elements.some(element => elementDoesOpenOrCloseOnLine(element, line));
    }

    return {
      JSXOpeningElement: function (node) {
        if (!node.parent) {
          return;
        }

        const openingStartLine = node.loc.start.line;

        // Parent
        if (node.parent.parent && node.parent.parent.openingElement) {
          const parentOpeningStartLine = node.parent.parent.openingElement.loc.end.line;

          if (parentOpeningStartLine === openingStartLine) {
            context.report({
              node: node,
              message: `Opening tag for Element \`${node.name.name}\` must be placed on a new line`,
              fix: generateFixFunction(node)
            });
          }
        }

        // Siblings
        if (node.parent.parent && node.parent.parent.children && node.parent.parent.children.length) {
          const firstSiblingOnLine = node.parent.parent.children.find(sibling => (
            sibling.type === 'JSXElement' && elementDoesOpenOrCloseOnLine(sibling, openingStartLine)
          ));

          if (firstSiblingOnLine !== node.parent) {
            context.report({
              node: node,
              message: `Opening tag for Element \`${node.name.name}\` must be placed on a new line`,
              fix: generateFixFunction(node)
            });
          }
        }
      },

      JSXClosingElement: function (node) {
        if (!node.parent || !node.parent.children.length) {
          return;
        }

        const closingElementStartLine = node.loc.end.line;

        if (!anyElementDoesOpenOrCloseOnLine(node.parent.children, closingElementStartLine)) {
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
