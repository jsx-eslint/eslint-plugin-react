/**
 * @fileoverview Prevent missing React when using JSX
 * @author Glen Mailer
 */
'use strict';

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports = function(context) {

  var NOT_DEFINED_MESSAGE = '\'React\' must be in scope when using JSX';

  function findVariable(variables, name) {
    var i, len;
    for (i = 0, len = variables.length; i < len; i++) {
      if (variables[i].name === name) {
        return true;
      }
    }
    return false;
  }

  function variablesInScope() {
    var scope = context.getScope(),
      variables = scope.variables;

    while (scope.type !== 'global') {
      scope = scope.upper;
      variables = scope.variables.concat(variables);
    }

    return variables;
  }

  return {

    JSXOpeningElement: function(node) {
      var variables = variablesInScope();
      if (!findVariable(variables, 'React')) {
        context.report(node, NOT_DEFINED_MESSAGE);
      }
    }

  };

};
