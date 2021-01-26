'use strict';

/**
 * Returns the list of parents for the node, starting from the closest parent.
 * @param {ASTNode} node - root node to start parent traversal
 * @returns {Array.<ASTNode>} List of nodes or empty
 */
function getNodeAncestors(node) {
  const ancestors = [];
  if (!node) {
    return ancestors;
  }

  // eslint-disable-next-line no-cond-assign
  for (let parent = node; parent = parent.parent;) {
    ancestors.push(parent);
  }
  return ancestors;
}

module.exports = getNodeAncestors;
