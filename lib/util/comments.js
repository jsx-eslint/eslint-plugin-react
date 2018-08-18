/**
 * @fileoverview Utility functions for comments handling.
 */
'use strict';

/**
 * Backports sourceCode.getCommentsBefore() for ESLint 3
 *
 * @param {Object} nodeOrToken Node or token to get comments for.
 * @param {Object} sourceCode The SourceCode object.
 * @returns {Array} Array of comment tokens.
 */
function getCommentsBefore(nodeOrToken, sourceCode) {
  const token = sourceCode.getFirstToken(nodeOrToken, {includeComments: true});
  let previousComments = [];

  // ESLint >=4.x
  if (sourceCode.getCommentsBefore) {
    previousComments = sourceCode.getCommentsBefore(token);
  // ESLint 3.x
  } else {
    let currentToken = token;
    do {
      const previousToken = sourceCode.getTokenBefore(currentToken);
      const potentialComment = sourceCode.getTokenBefore(currentToken, {includeComments: true});

      if (previousToken !== potentialComment) {
        previousComments.push(potentialComment);
        currentToken = potentialComment;
      } else {
        currentToken = null;
      }
    } while (currentToken);
    previousComments = previousComments.reverse();
  }

  return previousComments;
}

/**
 * Backports sourceCode.getCommentsAfter() for ESLint 3
 *
 * @param {Object} nodeOrToken Node or token to get comments for.
 * @param {Object} sourceCode The SourceCode object.
 * @returns {Array} Array of comment tokens.
 */
function getCommentsAfter(nodeOrToken, sourceCode) {
  const token = sourceCode.getLastToken(nodeOrToken, {includeComments: true});
  let nextComments = [];

  // ESLint >=4.x
  if (sourceCode.getCommentsAfter) {
    nextComments = sourceCode.getCommentsAfter(token);
  // ESLint 3.x
  } else {
    let currentToken = token;
    do {
      const nextToken = sourceCode.getTokenAfter(currentToken);
      const potentialComment = sourceCode.getTokenAfter(currentToken, {includeComments: true});

      if (nextToken !== potentialComment) {
        nextComments.push(potentialComment);
        currentToken = potentialComment;
      } else {
        currentToken = null;
      }
    } while (currentToken);
  }

  return nextComments;
}

module.exports = {
  getCommentsBefore: getCommentsBefore,
  getCommentsAfter: getCommentsAfter
};
