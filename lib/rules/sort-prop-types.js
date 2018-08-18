/**
 * @fileoverview Enforce propTypes declarations alphabetical sorting
 */
'use strict';

const variableUtil = require('../util/variable');
const propsUtil = require('../util/props');
const commentsUtil = require('../util/comments');
const docsUrl = require('../util/docsUrl');
const propWrapperUtil = require('../util/propWrapper');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce propTypes declarations alphabetical sorting',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('sort-prop-types')
    },

    fixable: 'code',

    schema: [{
      type: 'object',
      properties: {
        requiredFirst: {
          type: 'boolean'
        },
        callbacksLast: {
          type: 'boolean'
        },
        ignoreCase: {
          type: 'boolean'
        },
        // Whether alphabetical sorting should be enforced
        noSortAlphabetically: {
          type: 'boolean'
        },
        sortShapeProp: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: function(context) {
    const sourceCode = context.getSourceCode();
    const configuration = context.options[0] || {};
    const requiredFirst = configuration.requiredFirst || false;
    const callbacksLast = configuration.callbacksLast || false;
    const ignoreCase = configuration.ignoreCase || false;
    const noSortAlphabetically = configuration.noSortAlphabetically || false;
    const sortShapeProp = configuration.sortShapeProp || false;
    const commentsAttachment = context.settings.comments || 'above';

    function getKey(node) {
      if (node.key && node.key.value) {
        return node.key.value;
      }
      return sourceCode.getText(node.key || node.argument);
    }

    function getValueName(node) {
      return node.type === 'Property' && node.value.property && node.value.property.name;
    }

    function isCallbackPropName(propName) {
      return /^on[A-Z]/.test(propName);
    }

    function isRequiredProp(node) {
      return getValueName(node) === 'isRequired';
    }

    function isShapeProp(node) {
      return Boolean(
        node && node.callee && node.callee.property && node.callee.property.name === 'shape'
      );
    }

    function getShapeProperties (node) {
      return node.arguments && node.arguments[0] && node.arguments[0].properties;
    }

    function sorter(a, b) {
      let aKey = getKey(a);
      let bKey = getKey(b);
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

      if (ignoreCase) {
        aKey = aKey.toLowerCase();
        bKey = bKey.toLowerCase();
      }

      if (aKey < bKey) {
        return -1;
      }
      if (aKey > bKey) {
        return 1;
      }
      return 0;
    }

    function getRelatedComments(node, nextNode) {
      // check for an end of line comment
      const nextNodeComments = nextNode
        ? commentsUtil.getCommentsBefore(nextNode, sourceCode)
        : commentsUtil.getCommentsAfter(node, sourceCode);
      if (nextNodeComments.length === 1) {
        const comment = nextNodeComments[0];
        if (comment.loc.start.line === comment.loc.end.line && comment.loc.end.line === node.loc.end.line) {
          return {comments: nextNodeComments, isSameLine: true};
        }
      }

      if (commentsAttachment === 'above') {
        return {comments: commentsUtil.getCommentsBefore(node, sourceCode), isSameLine: false};
      }

      return {comments: nextNodeComments, isSameLine: false};
    }

    function replaceNodeWithText(source, originalNode, sortedNodeText) {
      return `${source.slice(0, originalNode.range[0])}${sortedNodeText}${source.slice(originalNode.range[1])}`;
    }

    function sortNodeWithComments(source, originalAttr, originalComments, sortedAttrText, sortedComments) {
      if (sortedComments.length && originalComments.length) {
        const swapComments = () => {
          const sortedCommentsText = sourceCode.getText().slice(
            sortedComments[0].range[0],
            sortedComments[sortedComments.length - 1].range[1]
          );
          return `${source.slice(0, originalComments[0].range[0])}${sortedCommentsText}${source.slice(originalComments[originalComments.length - 1].range[1])}`;
        };
        if (originalAttr.range[1] < originalComments[0].range[0]) {
          source = swapComments();
          source = replaceNodeWithText(source, originalAttr, sortedAttrText);
        } else {
          source = replaceNodeWithText(source, originalAttr, sortedAttrText);
          source = swapComments();
        }
        return source;
      }

      if (sortedComments.length) {
        const sortedCommentsText = sourceCode.getText().slice(
          sortedComments[0].range[0],
          sortedComments[sortedComments.length - 1].range[1]
        );

        const indent = Array(sortedComments[0].loc.start.column + 1).join(' ');
        if (commentsAttachment === 'above') {
          source = replaceNodeWithText(source, originalAttr, sortedAttrText);
          source = `${source.slice(0, originalAttr.range[0])}${sortedCommentsText}\n${indent}${source.slice(originalAttr.range[0])}`;
        } else {
          const nextToken = sourceCode.getTokenAfter(originalAttr);
          const targetIndex = nextToken.value === ',' ? nextToken.range[1] : originalAttr.range[1];
          source = `${source.slice(0, targetIndex)}\n${indent}${sortedCommentsText}${source.slice(targetIndex)}`;
          source = replaceNodeWithText(source, originalAttr, sortedAttrText);
        }
        return source;
      }

      if (originalComments.length) {
        const removeComments = () => {
          const startLoc = sourceCode.getLocFromIndex(originalComments[0].range[0]);
          const lineStart = sourceCode.getIndexFromLoc({line: startLoc.line, column: 0});
          const endLoc = sourceCode.getLocFromIndex(originalComments[originalComments.length - 1].range[1]);
          const lineEnd = sourceCode.getIndexFromLoc({
            line: endLoc.line,
            column: sourceCode.lines[endLoc.line - 1].length - 1
          });
          return `${source.slice(0, lineStart)}${source.slice(lineEnd + 2)}`;
        };
        if (originalAttr.range[1] < originalComments[0].range[0]) {
          source = removeComments();
          source = replaceNodeWithText(source, originalAttr, sortedAttrText);
        } else {
          source = replaceNodeWithText(source, originalAttr, sortedAttrText);
          source = removeComments();
        }
        return source;
      }

      return null;
    }

    /**
     * Checks if propTypes declarations are sorted
     * @param {Array} declarations The array of AST nodes being checked.
     * @returns {void}
     */
    function checkSorted(declarations) {
      // Declarations will be `undefined` if the `shape` is not a literal. For
      // example, if it is a propType imported from another file.
      if (!declarations) {
        return;
      }

      function fix(fixer) {
        function sortInSource(allNodes, source) {
          const originalSource = source;
          const nodeGroups = allNodes.reduce((acc, curr) => {
            if (curr.type === 'ExperimentalSpreadProperty' || curr.type === 'SpreadElement') {
              acc.push([]);
            } else {
              acc[acc.length - 1].push(curr);
            }
            return acc;
          }, [[]]);

          nodeGroups.forEach(nodes => {
            const sortedAttributes = nodes.slice().sort(sorter);

            for (let i = nodes.length - 1; i >= 0; i--) {
              const sortedAttr = sortedAttributes[i];
              const attr = nodes[i];
              if (sortedAttr === attr) {
                continue;
              }

              const sortedComments = getRelatedComments(sortedAttr,
                allNodes[allNodes.indexOf(sortedAttr) + 1]).comments;
              const attrComments = getRelatedComments(attr, nodes[i + 1]).comments;

              let sortedAttrText = sourceCode.getText(sortedAttr);

              if (sortShapeProp && isShapeProp(sortedAttr.value)) {
                const shape = getShapeProperties(sortedAttr.value);
                if (shape) {
                  const attrSource = sortInSource(
                    shape,
                    originalSource
                  );
                  sortedAttrText = attrSource.slice(sortedAttr.range[0], sortedAttr.range[1]);
                }
              }

              const newSource = sortNodeWithComments(source, attr, attrComments, sortedAttrText, sortedComments);
              source = newSource || replaceNodeWithText(source, attr, sortedAttrText);
            }
          });
          return source;
        }

        const source = sortInSource(declarations, context.getSourceCode().getText());

        const startComments = getRelatedComments(declarations[0], declarations[1]);
        const endComments = getRelatedComments(declarations[declarations.length - 1], null);
        const rangeStart = (commentsAttachment === 'above' && startComments.comments.length && !startComments.isSameLine)
          ? startComments.comments[0].range[0]
          : declarations[0].range[0];
        const rangeEnd = (commentsAttachment === 'below' && endComments.comments.length || endComments.isSameLine)
          ? endComments.comments[endComments.comments.length - 1].range[1]
          : declarations[declarations.length - 1].range[1];
        return fixer.replaceTextRange([rangeStart, rangeEnd], source.slice(rangeStart, rangeEnd));
      }

      declarations.reduce((prev, curr, idx, decls) => {
        if (curr.type === 'ExperimentalSpreadProperty' || curr.type === 'SpreadElement') {
          return decls[idx + 1];
        }

        let prevPropName = getKey(prev);
        let currentPropName = getKey(curr);
        const previousIsRequired = isRequiredProp(prev);
        const currentIsRequired = isRequiredProp(curr);
        const previousIsCallback = isCallbackPropName(prevPropName);
        const currentIsCallback = isCallbackPropName(currentPropName);

        if (ignoreCase) {
          prevPropName = prevPropName.toLowerCase();
          currentPropName = currentPropName.toLowerCase();
        }

        if (requiredFirst) {
          if (previousIsRequired && !currentIsRequired) {
            // Transition between required and non-required. Don't compare for alphabetical.
            return curr;
          }
          if (!previousIsRequired && currentIsRequired) {
            // Encountered a non-required prop after a required prop
            context.report({
              node: curr,
              message: 'Required prop types must be listed before all other prop types',
              fix
            });
            return curr;
          }
        }

        if (callbacksLast) {
          if (!previousIsCallback && currentIsCallback) {
            // Entering the callback prop section
            return curr;
          }
          if (previousIsCallback && !currentIsCallback) {
            // Encountered a non-callback prop after a callback prop
            context.report({
              node: prev,
              message: 'Callback prop types must be listed after all other prop types',
              fix
            });
            return prev;
          }
        }

        if (!noSortAlphabetically && currentPropName < prevPropName) {
          context.report({
            node: curr,
            message: 'Prop types declarations should be sorted alphabetically',
            fix
          });
          return prev;
        }

        return curr;
      }, declarations[0]);
    }

    function checkNode(node) {
      switch (node && node.type) {
        case 'ObjectExpression':
          checkSorted(node.properties);
          break;
        case 'Identifier':
          const propTypesObject = variableUtil.findVariableByName(context, node.name);
          if (propTypesObject && propTypesObject.properties) {
            checkSorted(propTypesObject.properties);
          }
          break;
        case 'CallExpression':
          const innerNode = node.arguments && node.arguments[0];
          if (propWrapperUtil.isPropWrapperFunction(context, node.callee.name) && innerNode) {
            checkNode(innerNode);
          }
          break;
        default:
          break;
      }
    }

    return {
      CallExpression: function(node) {
        if (!sortShapeProp || !isShapeProp(node) || !(node.arguments && node.arguments[0])) {
          return;
        }
        checkSorted(node.arguments[0].properties);
      },

      ClassProperty: function(node) {
        if (!propsUtil.isPropTypesDeclaration(node)) {
          return;
        }
        checkNode(node.value);
      },

      MemberExpression: function(node) {
        if (!propsUtil.isPropTypesDeclaration(node)) {
          return;
        }

        checkNode(node.parent.right);
      },

      ObjectExpression: function(node) {
        node.properties.forEach(property => {
          if (!property.key) {
            return;
          }

          if (!propsUtil.isPropTypesDeclaration(property)) {
            return;
          }
          if (property.value.type === 'ObjectExpression') {
            checkSorted(property.value.properties);
          }
        });
      }

    };
  }
};
