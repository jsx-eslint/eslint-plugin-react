/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */
'use strict';

var Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = Components.detect(function(context, components) {

  var MULTI_COMP_MESSAGE = 'Declare only one React component per file';

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {
    'Program:exit': function() {
      if (components.length() <= 1) {
        return;
      }

      var list = components.list();
      var i = 0;

      for (var component in list) {
        if (!list.hasOwnProperty(component) || ++i === 1) {
          continue;
        }
        context.report(list[component].node, MULTI_COMP_MESSAGE);
      }
    }
  };
});

module.exports.schema = [];
