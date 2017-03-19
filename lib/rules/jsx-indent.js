/**
 * @fileoverview Validate JSX indentation
 * @author Yannick Croissant

 * This rule has been ported and modified from eslint and nodeca.
 * @author Vitaly Puzrin
 * @author Gyandeep Singh
 * @copyright 2015 Vitaly Puzrin. All rights reserved.
 * @copyright 2015 Gyandeep Singh. All rights reserved.
 Copyright (C) 2014 by Vitaly Puzrin

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the 'Software'), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = {
  meta: {
    docs: {
      description: 'Validate JSX indentation',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'whitespace',
    schema: [{
      oneOf: [{
        enum: ['tab']
      }, {
        type: 'integer'
      }]
    }, {
      type: 'object',
      properties: {
        indentLogicalExpressions: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: function(context) {

    var MESSAGE = 'Expected indentation of {{needed}} {{type}} {{characters}} but found {{gotten}}.';

    var extraColumnStart = 0;
    var indentType = 'space';
    var indentSize = 4;
    var indentLogicalExpressions = false;

    var sourceCode = context.getSourceCode();

    if (context.options.length) {
      if (context.options[0] === 'tab') {
        indentSize = 1;
        indentType = 'tab';
      } else if (typeof context.options[0] === 'number') {
        indentSize = context.options[0];
        indentType = 'space';
      }
      if (context.options[1]) {
        indentLogicalExpressions = context.options[1].indentLogicalExpressions || false;
      }
    }

    var indentChar = indentType === 'space' ? ' ' : '\t';

    /**
     * Responsible for fixing the indentation issue fix
     * @param {Boolean} rangeToReplace is used to specify the range
     *   to replace with the correct indentation.
     * @param {Number} needed Expected indentation character count
     * @returns {Function} function to be executed by the fixer
     * @private
     */
    function getFixerFunction(rangeToReplace, needed) {
      return function(fixer) {
        var indent = Array(needed + 1).join(indentChar);
        return fixer.replaceTextRange(rangeToReplace, indent);
      };
    }

    /**
     * Reports a given indent violation and properly pluralizes the message
     * @param {ASTNode} node Node violating the indent rule
     * @param {Number} needed Expected indentation character count
     * @param {Number} gotten Indentation character count in the actual node/code
     * @param {Array} rangeToReplace is used in the fixer.
     *   Defaults to the indent of the start of the node
     * @param {Object} loc Error line and column location (defaults to node.loc
     */
    function report(node, needed, gotten, rangeToReplace, loc) {
      var msgContext = {
        needed: needed,
        type: indentType,
        characters: needed === 1 ? 'character' : 'characters',
        gotten: gotten
      };
      rangeToReplace = rangeToReplace || [node.start - node.loc.start.column, node.start];

      context.report({
        node: node,
        loc: loc || node.loc,
        message: MESSAGE,
        data: msgContext,
        fix: getFixerFunction(rangeToReplace, needed)
      });
    }

    /**
     * Get the indentation (of the proper indentType) that exists in the source
     * @param {String} src the source string
     * @param {Boolean} byLastLine whether the line checked should be the last
     *   Defaults to the first line
     * @param {Boolean} excludeCommas whether to skip commas in the check
     *   Defaults to false
     * @return {Number} the indentation of the indentType that exists on the line
     */
    function getIndentFromString(src, byLastLine, excludeCommas) {
      var lines = src.split('\n');
      if (byLastLine) {
        src = lines[lines.length - 1];
      } else {
        src = lines[0];
      }

      var skip = excludeCommas ? ',' : '';

      var regExp;
      if (indentType === 'space') {
        regExp = new RegExp('^[ ' + skip + ']+');
      } else {
        regExp = new RegExp('^[\t' + skip + ']+');
      }

      var indent = regExp.exec(src);
      return indent ? indent[0].length : 0;
    }

    /**
     * Get node indent
     * @param {ASTNode} node Node to examine
     * @param {Boolean} byLastLine get indent of node's last line
     * @param {Boolean} excludeCommas skip comma on start of line
     * @return {Number} Indent
     */
    function getNodeIndent(node, byLastLine, excludeCommas) {
      byLastLine = byLastLine || false;
      excludeCommas = excludeCommas || false;

      var src = sourceCode.getText(node, node.loc.start.column + extraColumnStart);

      return getIndentFromString(src, byLastLine, excludeCommas);
    }

    /**
     * Checks if the node is the first in its own start line. By default it looks by start line.
     * One exception is closing tags with preceeding whitespace
     * @param {ASTNode} node The node to check
     * @return {Boolean} true if its the first in the its start line
     */
    function isNodeFirstInLine(node) {
      var token = node;
      do {
        token = sourceCode.getTokenBefore(token);
      } while (token.type === 'JSXText' && /^\s*$/.test(token.value));
      var startLine = node.loc.start.line;
      var endLine = token ? token.loc.end.line : -1;
      var whitespaceOnly = token ? /\n\s*$/.test(token.value) : false;

      return startLine !== endLine || whitespaceOnly;
    }

  /**
   * Check if the node is the right member of a logical expression
   * @param {ASTNode} node The node to check
   * @return {Boolean} true if its the case, false if not
   */
    function isRightInLogicalExp(node) {
      return (
        node.parent &&
        node.parent.parent &&
        node.parent.parent.type === 'LogicalExpression' &&
        node.parent.parent.right === node.parent
      );
    }

  /**
   * Check if the node is the alternate member of a conditional expression
   * @param {ASTNode} node The node to check
   * @return {Boolean} true if its the case, false if not
   */
    function isAlternateInConditionalExp(node) {
      return (
        node.parent &&
        node.parent.parent &&
        node.parent.parent.type === 'ConditionalExpression' &&
        node.parent.parent.alternate === node.parent &&
        sourceCode.getTokenBefore(node).value !== '('
      );
    }

    /**
     * Check indent for nodes list
     * @param {ASTNode} node The node to check
     * @param {Number} indent needed indent
     * @param {Boolean} excludeCommas skip comma on start of line
     */
    function checkNodesIndent(node, indent, excludeCommas) {
      var nodeIndent = getNodeIndent(node, false, excludeCommas);
      var isCorrectRightInLogicalExp = isRightInLogicalExp(node) && (nodeIndent - indent) === indentSize;
      var isCorrectAlternateInCondExp = isAlternateInConditionalExp(node) && (nodeIndent - indent) === 0;
      if (
        nodeIndent !== indent &&
        isNodeFirstInLine(node) &&
        !isCorrectRightInLogicalExp &&
        !isCorrectAlternateInCondExp
      ) {
        report(node, indent, nodeIndent);
      }
    }

    /**
     * Checks the end of the tag (>) to determine whether it's on its own line
     * If so, it verifies the indentation is correct and reports if it is not
     * @param {ASTNode} node The node to check
     * @param {Number} startIndent The indentation of the start of the tag
     */
    function checkTagEndIndent(node, startIndent) {
      var source = sourceCode.getText(node);
      var isTagEndOnOwnLine = /\n\s*\/?>$/.exec(source);
      if (isTagEndOnOwnLine) {
        var endIndent = getIndentFromString(source, true, false);
        if (endIndent !== startIndent) {
          var rangeToReplace = [node.end - node.loc.end.column, node.end - 1];
          report(node, startIndent, endIndent, rangeToReplace);
        }
      }
    }

    /**
     * Gets what the JSXOpeningElement's indentation should be
     * @param {ASTNode} node The JSXOpeningElement
     * @return {Number} the number of indentation characters it should have
     */
    function getOpeningElementIndent(node) {
      var prevToken = sourceCode.getTokenBefore(node);
      if (!prevToken) {
        return 0;
      }
      if (prevToken.type === 'JSXText' || prevToken.type === 'Punctuator' && prevToken.value === ',') {
        // Use the parent in a list or an array
        prevToken = sourceCode.getNodeByRangeIndex(prevToken.start);
        prevToken = prevToken.type === 'Literal' ? prevToken.parent : prevToken;
      } else if (prevToken.type === 'Punctuator' && prevToken.value === ':') {
        // Use the first non-punctuator token in a conditional expression
        do {
          prevToken = sourceCode.getTokenBefore(prevToken);
        } while (prevToken.type === 'Punctuator');
        prevToken = sourceCode.getNodeByRangeIndex(prevToken.range[0]);

        while (prevToken.parent && prevToken.parent.type !== 'ConditionalExpression') {
          prevToken = prevToken.parent;
        }
      }
      prevToken = prevToken.type === 'JSXExpressionContainer' ? prevToken.expression : prevToken;

      var parentElementIndent = getNodeIndent(prevToken);
      if (prevToken.type === 'JSXElement' && (!prevToken.parent || prevToken.parent.type !== 'LogicalExpression')) {
        parentElementIndent = getOpeningElementIndent(prevToken.openingElement);
      }

      if (isRightInLogicalExp(node) && indentLogicalExpressions) {
        parentElementIndent += indentSize;
      }

      var indent = (
        prevToken.loc.start.line === node.loc.start.line ||
        isRightInLogicalExp(node) ||
        isAlternateInConditionalExp(node)
      ) ? 0 : indentSize;
      return parentElementIndent + indent;
    }

    return {
      JSXOpeningElement: function(node) {
        var prevToken = sourceCode.getTokenBefore(node);
        if (!prevToken) {
          return;
        }
        var startIndent = getOpeningElementIndent(node);
        checkNodesIndent(node, startIndent);
        checkTagEndIndent(node, startIndent);
      },
      JSXClosingElement: function(node) {
        if (!node.parent) {
          return;
        }
        var peerElementIndent = getOpeningElementIndent(node.parent.openingElement);
        checkNodesIndent(node, peerElementIndent);
      },
      JSXExpressionContainer: function(node) {
        if (!node.parent) {
          return;
        }
        var parentNodeIndent = getNodeIndent(node.parent);
        checkNodesIndent(node, parentNodeIndent + indentSize);
      },
      Literal: function(node) {
        if (!node.parent || node.parent.type !== 'JSXElement' || node.loc.start.line === node.parent.loc.start.line) {
          return;
        }
        var parentElementIndent = getOpeningElementIndent(node.parent.openingElement);
        var expectedIndent = parentElementIndent + indentSize;
        var source = sourceCode.getText(node);
        var lines = source.split('\n');
        var currentIndex = 0;
        lines.forEach(function(line, lineNumber) {
          if (line.trim()) {
            var lineIndent = getIndentFromString(line);
            if (lineIndent !== expectedIndent) {
              var lineStart = source.indexOf(line, currentIndex);
              var lineIndentStart = line.search(/\S/);
              var lineIndentEnd = lineStart + lineIndentStart;
              var rangeToReplace = [node.start + lineStart, node.start + lineIndentEnd];
              var locLine = lineNumber + node.loc.start.line;
              var loc = {
                start: {line: locLine, column: lineIndentStart},
                end: {line: locLine, column: lineIndentEnd}
              };
              report(node, expectedIndent, lineIndent, rangeToReplace, loc);
            }
          }
          currentIndex += line.length;
        });
      }
    };

  }
};
