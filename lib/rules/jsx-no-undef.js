/**
 * @fileoverview Disallow undeclared variables in JSX
 * @author Yannick Croissant
 */

'use strict';

/**
 * Checks if a node name match the JSX tag convention.
 * @param {String} name - Name of the node to check.
 * @returns {boolean} Whether or not the node name match the JSX tag convention.
 */
var tagConvention = /^[a-z]|\-/;
function isTagName(name) {
  return tagConvention.test(name);
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow undeclared variables in JSX',
      category: 'Possible Errors',
      recommended: true
    },
    fixable: 'code',
    schema: []
  },

  create: function(context) {

    /**
     * Compare an identifier with the variables declared in the scope
     * @param {ASTNode} node - Identifier or JSXIdentifier node
     * @returns {void}
     */
    function checkIdentifierInJSX(node) {
      var scope = context.getScope();
      var variables = scope.variables;
      var i;
      var len;

      // Ignore 'this' keyword (also maked as JSXIdentifier when used in JSX)
      if (node.name === 'this') {
        return;
      }

      while (scope.type !== 'global') {
        scope = scope.upper;
        variables = scope.variables.concat(variables);
      }
      if (scope.childScopes.length) {
        variables = scope.childScopes[0].variables.concat(variables);
        // Temporary fix for babel-eslint
        if (scope.childScopes[0].childScopes.length) {
          variables = scope.childScopes[0].childScopes[0].variables.concat(variables);
        }
      }

      for (i = 0, len = variables.length; i < len; i++) {
        if (variables[i].name === node.name) {
          return;
        }
      }

      context.report({
        node: node,
        message: '\'' + node.name + '\' is not defined.',
        fix: function(fixer) {
          var path = require('path');
          var spawn = require('child_process').spawnSync;

          var filename = context.getFilename();
          var importRoot = context.options[0];
          var searchRoot = filename.substring(0, filename.lastIndexOf('/' + importRoot + '/')) + '/' + importRoot + '/';

          var findOut = spawn('find', [
            searchRoot,
            '-type', 'f',
            '-name', node.name + '.js'
          ]).stdout.toString();

          var importPath = '';
          if (findOut.length > 0) {
            importPath = '\'' + path.relative(searchRoot, findOut.replace(/...\n$/, '')) + '\'';
          }

          return fixer.insertTextAfterRange([0, 0], 'import ' + node.name + ' from ' + importPath + ';\n');
        }
      });
    }

    return {
      JSXOpeningElement: function(node) {
        switch (node.name.type) {
          case 'JSXIdentifier':
            node = node.name;
            if (isTagName(node.name)) {
              return;
            }
            break;
          case 'JSXMemberExpression':
            node = node.name;
            do {
              node = node.object;
            } while (node && node.type !== 'JSXIdentifier');
            break;
          case 'JSXNamespacedName':
            node = node.name.namespace;
            break;
          default:
            break;
        }
        checkIdentifierInJSX(node);
      }
    };

  }
};
