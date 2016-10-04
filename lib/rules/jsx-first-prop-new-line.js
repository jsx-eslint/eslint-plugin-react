/**
 * @fileoverview Ensure proper position of the first property in JSX
 * @author Joachim Seminck
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Ensure proper position of the first property in JSX',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',

    schema: [{
      enum: ['always', 'never', 'multiline', 'multiline-multiprop']
    }]

  },

  create: function (context) {
    var configuration = context.options[0];
    var indentType = 'space';
    var indentSize = 2;
    var sourceCode = context.getSourceCode();

    if (context.options.length > 1) {
      if (context.options[1] === 'tab') {
        indentSize = 1;
        indentType = 'tab';
      } else if (typeof context.options[1] === 'number') {
        indentSize = context.options[1];
        indentType = 'space';
      }
    }

    function getNodeIndent(node) {
      var src = sourceCode.getText(node, node.loc.start.column).split('\n')[0];
      var regExp;
      if (indentType === 'space') {
        regExp = new RegExp('^[ ]+');
      } else {
        regExp = new RegExp('^[\t' + ']+');
      }
      var indent = regExp.exec(src);
      return indent ? indent[0].length : 0;
    }

    function isMultilineJSX(jsxNode) {
      return jsxNode.loc.start.line < jsxNode.loc.end.line;
    }

    return {
      JSXOpeningElement: function (node) {
        if (
          (configuration === 'multiline' && isMultilineJSX(node)) ||
          (configuration === 'multiline-multiprop' && isMultilineJSX(node) && node.attributes.length > 1) ||
          (configuration === 'always')
        ) {
          node.attributes.forEach(function(decl) {
            if (decl.loc.start.line === node.loc.start.line) {
              context.report({
                node: decl,
                message: 'Property should be placed on a new line',
                fix: function(fixer) {
                  var neededIndent = getNodeIndent(node) + indentSize;
                  var insert = '\n' + Array(neededIndent + 1).join(indentType === 'space' ? ' ' : '\t');
                  return fixer.replaceTextRange([node.name.end, decl.start], insert);
                }
              });
            }
          });
        } else if (configuration === 'never' && node.attributes.length > 0) {
          var firstNode = node.attributes[0];
          if (node.loc.start.line < firstNode.loc.start.line) {
            context.report({
              node: firstNode,
              message: 'Property should be placed on the same line as the component declaration',
              fix: function(fixer) {
                return fixer.replaceTextRange([node.name.end, firstNode.start], ' ');
              }
            });
            return;
          }
        }
        return;
      }
    };
  }
};
