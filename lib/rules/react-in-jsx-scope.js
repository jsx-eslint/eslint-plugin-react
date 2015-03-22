/**
 * @fileoverview Prevent missing React when using JSX
 * @author Glen Mailer
 */
'use strict';

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

var JSX_ANNOTATION_REGEX = /^\*\s*@jsx\s+([^\s]+)/;

module.exports = function(context) {

  var id = 'React';
  var NOT_DEFINED_MESSAGE = '\'{{name}}\' must be in scope when using JSX';

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
    if (scope.childScopes.length) {
      variables = scope.childScopes[0].variables.concat(variables);
    }

    return variables;
  }

  return {

    JSXOpeningElement: function(node) {
      var variables = variablesInScope();
      if (findVariable(variables, id)) {
        return;
      }
      context.report(node, NOT_DEFINED_MESSAGE, {
        name: id
      });
    },

    BlockComment: function(node) {
      var matches = JSX_ANNOTATION_REGEX.exec(node.value);
      if (!matches) {
        return;
      }
      id = matches[1].split('.')[0];
    }

  };

};
