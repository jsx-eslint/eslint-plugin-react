/**
 * @fileoverview Prevent extra closing tags for components without children
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  // HTML5 and SVG elements whitelist
  var standardElements = [
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body',
    'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details',
    'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2',
    'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen',
    'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript',
    'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby',
    's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup',
    'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var',
    'video', 'wbr', 'circle', 'defs', 'ellipse', 'g', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon',
    'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'
  ];

  function isComponent(node) {
    return node.name && node.name.type === 'XJSIdentifier' && standardElements.indexOf(node.name.name) === -1;
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

    'XJSOpeningElement': function(node) {
      if (!isComponent(node) || node.selfClosing || hasChildren(node)) {
        return;
      }
      context.report(node, 'Empty components are self-closing');
    }
  };

};
