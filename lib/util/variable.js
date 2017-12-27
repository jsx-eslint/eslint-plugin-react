/**
 * @fileoverview Utility functions for React components detection
 * @author Yannick Croissant
 */
'use strict';

/**
 * Search a particular variable in a list
 * @param {Array} variables The variables list.
 * @param {Array} name The name of the variable to search.
 * @returns {Boolean} True if the variable was found, false if not.
 */
function findVariable(variables, name) {
  return variables.some(variable => variable.name === name);
}

/**
 * Find and return a particular variable in a list
 * @param {Array} variables The variables list.
 * @param {Array} name The name of the variable to search.
 * @returns {Object} Variable if the variable was found, null if not.
 */
function getVariable(variables, name) {
  return variables.find(variable => variable.name === name);
}

/**
 * List all variable in a given scope
 *
 * Contain a patch for babel-eslint to avoid https://github.com/babel/babel-eslint/issues/21
 *
 * @param {Object} context The current rule context.
 * @returns {Array} The variables list
 */
function variablesInScope(context) {
  let scope = context.getScope();
  let variables = scope.variables;

  while (scope.type !== 'global') {
    scope = scope.upper;
    variables = scope.variables.concat(variables);
  }
  if (scope.childScopes.length) {
    variables = scope.childScopes[0].variables.concat(variables);
    if (scope.childScopes[0].childScopes.length) {
      variables = scope.childScopes[0].childScopes[0].variables.concat(variables);
    }
  }
  variables.reverse();

  return variables;
}

/**
 * Find a variable by name in the current scope.
 * @param {Object} context The current rule context.
 * @param  {string} name Name of the variable to look for.
 * @returns {ASTNode|null} Return null if the variable could not be found, ASTNode otherwise.
 */
function findVariableByName(context, name) {
  const variable = getVariable(variablesInScope(context), name);

  if (!variable || !variable.defs[0] || !variable.defs[0].node) {
    return null;
  }

  if (variable.defs[0].node.type === 'TypeAlias') {
    return variable.defs[0].node.right;
  }

  return variable.defs[0].node.init;
}


/**
 * Figure out whether a parameter definition of `variable` has a default
 * value of the same name as the variable itself, but in `this`.
 *
 * I.e. detect if `variable` is a parameter declared like
 * `function foo(props = this.props) { ... }`.
 *
 * @param {Variable} variable The Variable object to inspect
 * @returns {boolean} Whether it is an alias like described above.
 */
function isDeclaredWithDefaultFromInstanceField(variable) {
  return variable.defs.some(def => {
    if (def.type === 'Parameter') {
      const assign = def.name.parent;
      if (assign && assign.type === 'AssignmentPattern') {
        if (assign.right && assign.right.type === 'MemberExpression') {
          const object = assign.right.object;
          const property = assign.right.property;
          if (object && property && object.type === 'ThisExpression' && property.type === 'Identifier' && property.name === variable.name) {
            return true;
          }
        }
      }
    }
    return false;
  });
}

module.exports = {
  findVariable: findVariable,
  findVariableByName: findVariableByName,
  getVariable: getVariable,
  isDeclaredWithDefaultFromInstanceField: isDeclaredWithDefaultFromInstanceField,
  variablesInScope: variablesInScope
};
