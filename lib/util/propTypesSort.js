/**
 * @fileoverview Common propTypes sorting functionality.
 */

'use strict';

const includes = require('array-includes');
const toSorted = require('array.prototype.tosorted');

const astUtil = require('./ast');
const eslintUtil = require('./eslint');

const getCommentsAfter = eslintUtil.getCommentsAfter;
const getCommentsBefore = eslintUtil.getCommentsBefore;
const getSourceCode = eslintUtil.getSourceCode;
const getText = eslintUtil.getText;

/**
 * Returns the value name of a node.
 *
 * @param {ASTNode} node the node to check.
 * @returns {string} The name of the node.
 */
function getValueName(node) {
  return node.type === 'Property'
    && node.value.property
    && node.value.property.name;
}

/**
 * Checks if the prop is required or not.
 *
 * @param {ASTNode} node the prop to check.
 * @returns {boolean} true if the prop is required.
 */
function isRequiredProp(node) {
  return getValueName(node) === 'isRequired';
}

/**
 * Checks if the proptype is a callback by checking if it starts with 'on'.
 *
 * @param {string} propName the name of the proptype to check.
 * @returns {boolean} true if the proptype is a callback.
 */
function isCallbackPropName(propName) {
  return /^on[A-Z]/.test(propName);
}

/**
 * Checks if the prop is PropTypes.shape.
 *
 * @param {ASTNode} node the prop to check.
 * @returns {boolean} true if the prop is PropTypes.shape.
 */
function isShapeProp(node) {
  return !!(
    node
    && node.callee
    && node.callee.property
    && node.callee.property.name === 'shape'
  );
}

/**
 * Returns the properties of a PropTypes.shape.
 *
 * @param {ASTNode} node the prop to check.
 * @returns {Array} the properties of the PropTypes.shape node.
 */
function getShapeProperties(node) {
  return node.arguments
    && node.arguments[0]
    && node.arguments[0].properties;
}

/**
 * Compares two elements.
 *
 * @param {ASTNode} a the first element to compare.
 * @param {ASTNode} b the second element to compare.
 * @param {Context} context The context of the two nodes.
 * @param {boolean=} ignoreCase whether or not to ignore case when comparing the two elements.
 * @param {boolean=} requiredFirst whether or not to sort required elements first.
 * @param {boolean=} callbacksLast whether or not to sort callbacks after everything else.
 * @param {boolean=} noSortAlphabetically whether or not to disable alphabetical sorting of the elements.
 * @returns {number} the sort order of the two elements.
 */
function sorter(a, b, context, ignoreCase, requiredFirst, callbacksLast, noSortAlphabetically) {
  const aKey = String(astUtil.getKeyValue(context, a));
  const bKey = String(astUtil.getKeyValue(context, b));

  if (requiredFirst) {
    if (isRequiredProp(a) && !isRequiredProp(b)) {
      return -1;
    }
    if (!isRequiredProp(a) && isRequiredProp(b)) {
      return 1;
    }
  }

  if (callbacksLast) {
    if (isCallbackPropName(aKey) && !isCallbackPropName(bKey)) {
      return 1;
    }
    if (!isCallbackPropName(aKey) && isCallbackPropName(bKey)) {
      return -1;
    }
  }

  if (!noSortAlphabetically) {
    if (ignoreCase) {
      return aKey.localeCompare(bKey);
    }

    if (aKey < bKey) {
      return -1;
    }
    if (aKey > bKey) {
      return 1;
    }
  }
  return 0;
}

const commentnodeMap = new WeakMap(); // all nodes reference WeakMap for start and end range

/**
 * Returns the separator token of a declaration: the token after it, or its own last token
 * (some parsers include the separator in TS and Flow members). A separator on a later line
 * that the next declaration follows on the same line (comma-first style) belongs to that line instead.
 *
 * @param {Object} context The rule context.
 * @param {ASTNode} node The declaration node.
 * @returns {Token|null} The separator token.
 */
function getSeparator(context, node) {
  const sourceCode = getSourceCode(context);
  const nextToken = sourceCode.getTokenAfter(node);
  if (nextToken && includes([',', ';'], nextToken.value)) {
    const afterSeparator = sourceCode.getTokenAfter(nextToken);
    const commaFirst = nextToken.loc.start.line !== node.loc.end.line
      && afterSeparator && afterSeparator.loc.start.line === nextToken.loc.end.line;
    return commaFirst ? null : nextToken;
  }
  const lastToken = sourceCode.getLastToken(node);
  return includes([',', ';'], lastToken.value) ? lastToken : null;
}

/**
 * Returns comments that belong to the preceding declaration rather than the
 * next declaration: those starting on the line where the declaration, or its separator, ends,
 * when nothing but the closing brace follows them on that line.
 *
 * @param {Object} context The rule context.
 * @param {ASTNode|Token} nodeOrSeparator The declaration node, or its separator token.
 * @returns {Array} The trailing comments for the declaration.
 */
function getTrailingComments(context, nodeOrSeparator) {
  const line = nodeOrSeparator.loc.end.line;
  const nextToken = getSourceCode(context).getTokenAfter(nodeOrSeparator);
  if (nextToken && nextToken.loc.start.line === line && nextToken.value !== '}') {
    return [];
  }
  return getCommentsAfter(context, nodeOrSeparator).filter((comment) => comment.loc.start.line === line);
}

/**
 * Fixes sort order of prop types.
 *
 * @param {Context} context the second element to compare.
 * @param {Fixer} fixer the first element to compare.
 * @param {Array} declarations The context of the two nodes.
 * @param {boolean=} ignoreCase whether or not to ignore case when comparing the two elements.
 * @param {boolean=} requiredFirst whether or not to sort required elements first.
 * @param {boolean=} callbacksLast whether or not to sort callbacks after everything else.
 * @param {boolean=} noSortAlphabetically whether or not to disable alphabetical sorting of the elements.
 * @param {boolean=} sortShapeProp whether or not to sort propTypes defined in PropTypes.shape.
 * @returns {Object|*|{range, text}} the sort order of the two elements.
 */
function fixPropTypesSort(
  context,
  fixer,
  declarations,
  ignoreCase,
  requiredFirst,
  callbacksLast,
  noSortAlphabetically,
  sortShapeProp
) {
  let commentsOutCode = false;

  function sortInSource(allNodes, source) {
    const originalSource = source;
    const trailingCommentStarts = new Set();

    for (let i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      const separator = getSeparator(context, node);
      let commentAfter = [];
      let commentBefore = [];
      try {
        const previousToken = getSourceCode(context).getTokenBefore(node);
        // a comment on the opening brace's line (like `// eslint-disable-line`) belongs to that line
        const onOpeningLine = previousToken && previousToken.value === '{'
          && previousToken.loc.end.line !== node.loc.start.line
          ? previousToken.loc.end.line
          : null;
        commentBefore = getCommentsBefore(context, node)
          .filter((comment) => !trailingCommentStarts.has(comment.range[0]) && comment.loc.start.line !== onOpeningLine);
        commentAfter = getTrailingComments(context, separator || node);
        commentAfter.forEach((comment) => trailingCommentStarts.add(comment.range[0]));
      } catch (e) { /**/ }

      const first = commentBefore.length >= 1 ? commentBefore[0] : node;
      const last = commentAfter.length >= 1 ? commentAfter[commentAfter.length - 1] : separator || node;
      commentnodeMap.set(node, {
        start: first.range[0],
        end: last.range[1],
        separator,
        endsInLineComment: last.type === 'Line',
      });
    }
    const nodeGroups = allNodes.reduce((acc, curr) => {
      if (curr.type === 'ExperimentalSpreadProperty' || curr.type === 'SpreadElement') {
        acc.push([]);
      } else {
        acc[acc.length - 1].push(curr);
      }
      return acc;
    }, [[]]);

    nodeGroups.forEach((nodes) => {
      const sortedAttributes = toSorted(
        nodes,
        (a, b) => sorter(a, b, context, ignoreCase, requiredFirst, callbacksLast, noSortAlphabetically)
      );

      const sourceCodeText = getText(context);
      source = nodes.reduceRight((acc, attr, index) => {
        const sortedAttr = sortedAttributes[index];
        const commentNode = commentnodeMap.get(sortedAttr);
        const target = commentnodeMap.get(attr);
        let attrSource = sourceCodeText;
        if (sortShapeProp && isShapeProp(sortedAttr.value)) {
          const shape = getShapeProperties(sortedAttr.value);
          if (shape) {
            attrSource = sortInSource(
              shape,
              originalSource
            );
          }
        }
        // sorting a shape only changes text inside the node, so only offsets after it shift
        const shift = attrSource.length - sourceCodeText.length;
        const text = attrSource.slice(commentNode.start, commentNode.end + shift);
        // each position keeps its own separator
        const separatorText = target.separator ? target.separator.value : '';
        let sortedAttrText;
        if (commentNode.separator) {
          const separatorIndex = commentNode.separator.range[0] + shift - commentNode.start;
          sortedAttrText = `${text.slice(0, separatorIndex)}${separatorText}${text.slice(separatorIndex + 1)}`;
        } else if (commentNode.endsInLineComment) {
          // a separator after a line comment would be commented out
          const nodeEndIndex = sortedAttr.range[1] + shift - commentNode.start;
          sortedAttrText = `${text.slice(0, nodeEndIndex)}${separatorText}${text.slice(nodeEndIndex)}`;
        } else {
          sortedAttrText = `${text}${separatorText}`;
        }
        if (commentNode.endsInLineComment && /^[^\n]*\S/.test(acc.slice(target.end))) {
          // a line comment moved in front of more code on the same line would comment it out
          commentsOutCode = true;
        }
        return `${acc.slice(0, target.start)}${sortedAttrText}${acc.slice(target.end)}`;
      }, source);
    });
    return source;
  }

  const originalSource = getText(context);
  const source = sortInSource(declarations, originalSource);
  if (commentsOutCode) {
    return null;
  }

  const rangeStart = commentnodeMap.get(declarations[0]).start;
  const rangeEnd = commentnodeMap.get(declarations[declarations.length - 1]).end;
  // moved separators can change the sorted range's length; the text after it is unchanged
  return fixer.replaceTextRange([rangeStart, rangeEnd], source.slice(rangeStart, rangeEnd + source.length - originalSource.length));
}

module.exports = {
  fixPropTypesSort,
  isCallbackPropName,
  isRequiredProp,
  isShapeProp,
};
