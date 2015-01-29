/**
 * @fileoverview Prevent extra closing tags for components without children
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var tagConvention = /^[a-z]|\-/;
  function isTagName(name) {
    return tagConvention.test(name);
  }

  function isComponent(node) {
    return node.name && node.name.type === 'JSXIdentifier' && !isTagName(node.name.name);
  }

  function hasChildren(node) {
    if (
      !node.parent.children.length ||
      (node.parent.children[0].type === 'Literal' && !node.parent.children[0].value.trim())
    ) {
      return false;
    }
    return true;
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {

    'JSXOpeningElement': function(node) {
      if (!isComponent(node) || node.selfClosing || hasChildren(node)) {
        return;
      }
      context.report(node, 'Empty components are self-closing');
    }
  };

};
