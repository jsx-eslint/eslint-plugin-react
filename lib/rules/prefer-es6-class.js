/**
 * @fileoverview Prefer es6 class instead of createClass for React Component
 * @author Dan Hamilton
 */
'use strict';

var Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = Components.detect(function(context, components, utils) {
  var configuration = context.options[0] || 'always';

  return {
    ObjectExpression: function(node) {
      if (utils.isES5Component(node) && configuration === 'always') {
        context.report(node, 'Component should use es6 class instead of createClass');
      } else if (utils.isES6Component(node) && configuration === 'never') {
        context.report(node, 'Component should use createClass instead of es6 class');
      }
    }
  };
});

module.exports.schema = [];
