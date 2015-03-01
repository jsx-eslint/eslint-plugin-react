/**
 * @fileoverview Count <Jsx /> as use of the React variable
 * @author Glen Mailer
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  function flagReactAsUsedInJSX() {
    var scope = context.getScope(),
      variables = scope.variables,
      i,
      len;

    while (scope.type !== 'global') {
      scope = scope.upper;
      variables = [].concat.apply(scope.variables, variables);
    }

    // mark first React found with the same special flag used by no-unused-vars
    for (i = 0, len = variables.length; i < len; i++) {
      if (variables[i].name === 'React') {
        variables[i].eslintJSXUsed = true;
        return;
      }
    }
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {

    'JSXOpeningElement': function() {
      flagReactAsUsedInJSX();
    }
  };

};
