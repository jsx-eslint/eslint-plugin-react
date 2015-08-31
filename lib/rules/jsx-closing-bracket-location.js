/**
 * @fileoverview Validate closing bracket location in JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = function(context) {

  var MESSAGE = 'The closing bracket must be {{location}}';
  var MESSAGE_LOCATION = {
    'after-props': 'placed after the last prop',
    'after-tag': 'placed after the opening tag',
    'props-aligned': 'aligned with the last prop',
    'tag-aligned': 'aligned with the opening tag'
  };

  /**
   * Get expected location for the closing bracket
   * @param {Object} tokens Locations of the opening bracket, closing bracket and last prop
   * @return {String} Expected location for the closing bracket
   */
  function getExpectedLocation(tokens) {
    var location;
    // Is always after the opening tag if there is no props
    if (typeof tokens.lastProp === 'undefined') {
      location = 'after-tag';
    // Is always after the last prop if this one is on the same line as the opening bracket
    } else if (tokens.opening.line === tokens.lastProp.line) {
      location = 'after-props';
    // Else use configuration, or default value
    } else {
      location = context.options[0] && context.options[0].location || 'tag-aligned';
    }
    return location;
  }

  /**
   * Check if the closing bracket is correctly located
   * @param {Object} tokens Locations of the opening bracket, closing bracket and last prop
   * @param {String} expectedLocation Expected location for the closing bracket
   * @return {Boolean} True if the closing bracket is correctly located, false if not
   */
  function hasCorrectLocation(tokens, expectedLocation) {
    switch (expectedLocation) {
      case 'after-tag':
        return tokens.tag.line === tokens.closing.line;
      case 'after-props':
        return tokens.lastProp.line === tokens.closing.line;
      case 'props-aligned':
        return tokens.lastProp.column === tokens.closing.column;
      case 'tag-aligned':
        return tokens.opening.column === tokens.closing.column;
      default:
        return true;
    }
  }

  /**
   * Get the locations of the opening bracket, closing bracket and last prop
   * @param {ASTNode} node The node to check
   * @return {Object} Locations of the opening bracket, closing bracket and last prop
   */
  function getTokensLocations(node) {
    var opening = context.getFirstToken(node).loc.start;
    var closing = context.getLastTokens(node, node.selfClosing ? 2 : 1)[0].loc.start;
    var tag = context.getFirstToken(node.name).loc.start;
    var lastProp;
    if (node.attributes.length) {
      lastProp = node.attributes[node.attributes.length - 1];
      lastProp = {
        column: context.getFirstToken(lastProp).loc.start.column,
        line: context.getLastToken(lastProp).loc.end.line
      };
    }
    return {
      tag: tag,
      opening: opening,
      closing: closing,
      lastProp: lastProp
    };
  }

  return {
    JSXOpeningElement: function(node) {
      var tokens = getTokensLocations(node);
      var expectedLocation = getExpectedLocation(tokens);
      if (hasCorrectLocation(tokens, expectedLocation)) {
        return;
      }
      context.report(node, MESSAGE, {
        location: MESSAGE_LOCATION[expectedLocation]
      });
    }
  };

};

module.exports.schema = [{
  type: 'object',
  properties: {
    location: {
      enum: ['after-props', 'props-aligned', 'tag-aligned']
    }
  }
}];
