/**
 * @fileoverview Enforce PasalCase for user-defined JSX components
 * @author Jake Marsh
 */

'use strict';

var variableUtil = require('../util/variable');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var PASCAL_CASE_REGEX = /^[A-Z0-9]+[a-z0-9]+(?:[A-Z0-9]+[a-z0-9]*)*$/;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  return {
    JSXOpeningElement: function(node) {
      var variables = variableUtil.variablesInScope(context);

      switch (node.name.type) {
        case 'JSXIdentifier':
          node = node.name;
          break;
        case 'JSXMemberExpression':
          node = node.name.object;
          break;
        case 'JSXNamespacedName':
          node = node.name.namespace;
          break;
        default:
          break;
      }

      var isImportedVariable = variableUtil.findVariable(variables, node.name);
      var isPascalCase = PASCAL_CASE_REGEX.test(node.name);

      if (isImportedVariable && !isPascalCase) {
        context.report(node, 'Imported JSX component ' + node.name + ' must be in PascalCase');
      }
    }
  };

};
