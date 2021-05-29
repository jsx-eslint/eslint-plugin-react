/**
 * @fileoverview Utility functions for type annotation detection.
 * @author Yannick Croissant
 * @author Vitor Balocco
 */

'use strict';

/**
 * Checks if we are declaring a `props` argument with a flow type annotation.
 * @param {ASTNode} node The AST node being checked.
 * @param {Object} context
 * @returns {Boolean} True if the node is a type annotated props declaration, false if not.
 */
function isAnnotatedFunctionPropsDeclaration(node, context) {
  if (!node || !node.params || !node.params.length) {
    return false;
  }

  const typeNode = node.params[0].type === 'AssignmentPattern' ? node.params[0].left : node.params[0];

  const isAnnotated = typeNode.typeAnnotation;
  const isDestructuredProps = typeNode.type === 'ObjectPattern';

  if (isAnnotated) {
    if (isDestructuredProps) {
      return true;
    }

    const tokens = context.getFirstTokens(typeNode, 2);
    const isProps = tokens[0].value === 'props' || (tokens[1] && tokens[1].value === 'props');
    return isProps;
  }

  return false;
}

module.exports = {
  isAnnotatedFunctionPropsDeclaration
};
