/**
 * @fileoverview Prevent missing displayName in a React component definition
 * @author Yannick Croissant
 */
'use strict';

var Components = require('../util/Components');
var path = require('path');
var decamelize = require('decamelize');
var ignoredFilenames = ['<text>', '<input>'];

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce naming patterns',
      category: 'Best Practices',
      recommended: true
    },
    schema: [{
      type: 'object',
      properties: {
        acceptTranspilerName: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },
  create: Components.detect(function(context, components, utils) {

    var config = context.options[0] || {};
    var acceptTranspilerName = config.acceptTranspilerName || false;


    /**
     * Checks if we are declaring a display name
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if we are declaring a display name, false if not.
     */
    function isDisplayNameDeclaration(node) {
      // Special case for class properties
      // (babel-eslint does not expose property name so we have to rely on tokens)
      if (node.type === 'ClassProperty') {
        var tokens = context.getFirstTokens(node, 2);
        if (
          tokens[0].value === 'displayName' ||
          (tokens[1] && tokens[1].value === 'displayName')
        ) {
          return true;
        }
        return false;
      }

      return Boolean(
        node &&
        node.name === 'displayName'
      );
    }

    /**
     * Mark a prop type as declared
     * @param {ASTNode} node The AST node being checked.
     */
    function markDisplayNameAsDeclared(node, name) {
      components.set(node, {
        hasDisplayName: true,
        name: name
      });
    }

    /**
     * Reports missing display name for a given component
     * @param {Object} component The component to process
     */
    function reportNonMatchingComponentName(component, name, filename) {
      context.report(
        component.node,
        'Component name ' + name + ' does not match filename ' + filename
      );
    }

    /**
     * Checks if the component have a name set by the transpiler
     * @param {ASTNode} node The AST node being checked.
     * @returns {string} transpiler name
     */
    function getTranspilerName(node) {
      var namedObjectAssignment = (
        node.type === 'ObjectExpression' &&
        node.parent &&
        node.parent.parent &&
        node.parent.parent.type === 'AssignmentExpression' && (
          !node.parent.parent.left.object ||
          node.parent.parent.left.object.name !== 'module' ||
          node.parent.parent.left.property.name !== 'exports'
        )
      );
      var namedObjectDeclaration = (
        node.type === 'ObjectExpression' &&
        node.parent &&
        node.parent.parent &&
        node.parent.parent.type === 'VariableDeclarator' &&
        node.parent.parent.id.name
      );
      var namedClass = (
        node.type === 'ClassDeclaration' &&
        node.id && node.id.name
      );

      var namedFunctionDeclaration = (
        (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') &&
        node.id &&
        node.id.name
      );

      var namedFunctionExpression = (
        (node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') &&
        node.parent &&
        (node.parent.type === 'VariableDeclarator' || node.parent.method === true) &&
        node.parent.id.name
      );

      return (
        namedObjectAssignment || namedObjectDeclaration ||
        namedClass ||
        namedFunctionDeclaration || namedFunctionExpression
      );
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      ClassProperty: function(node) {
        if (!isDisplayNameDeclaration(node)) {
          return;
        }
        markDisplayNameAsDeclared(node);
      },

      MemberExpression: function(node) {
        if (!isDisplayNameDeclaration(node.property)) {
          return;
        }
        var component = utils.getRelatedComponent(node);
        if (!component) {
          return;
        }
        markDisplayNameAsDeclared(component.node, node.parent.right.value);
      },

      FunctionExpression: function(node) {
        if (!acceptTranspilerName || !getTranspilerName(node)) {
          return;
        }
        markDisplayNameAsDeclared(node, getTranspilerName(node));
      },

      FunctionDeclaration: function(node) {
        if (!acceptTranspilerName || !getTranspilerName(node)) {
          return;
        }
        markDisplayNameAsDeclared(node, getTranspilerName(node));
      },

      ArrowFunctionExpression: function(node) {
        if (!acceptTranspilerName || !getTranspilerName(node)) {
          return;
        }
        markDisplayNameAsDeclared(node, getTranspilerName(node));
      },

      MethodDefinition: function(node) {
        if (!isDisplayNameDeclaration(node.key)) {
          return;
        }
        markDisplayNameAsDeclared(node);
      },

      ClassDeclaration: function(node) {
        if (!acceptTranspilerName || !getTranspilerName(node)) {
          return;
        }
        markDisplayNameAsDeclared(node, getTranspilerName(node));
      },

      ObjectExpression: function(node) {
        if (!acceptTranspilerName || !getTranspilerName(node)) {
          // Search for the displayName declaration
          node.properties.forEach(function(property) {
            if (!property.key || !isDisplayNameDeclaration(property.key)) {
              return;
            }
            markDisplayNameAsDeclared(node, property.value.value);
          });
          return;
        }
        markDisplayNameAsDeclared(node, getTranspilerName(node));
      },

      'Program:exit': function() {
        var list = components.list();
        var filename = context.getFilename();
        var extension = path.extname(filename);
        var isFromStdin = ignoredFilenames.indexOf(filename) !== -1;
        var filenameWithoutExtension = path.basename(filename, extension);

        if (isFromStdin) {
          return;
        }

        // Report missing display name for all components
        for (var component in list) {
          if (list.hasOwnProperty(component) && list[component].hasDisplayName) {
            if (list[component].name && decamelize(list[component].name) !== filenameWithoutExtension) {
              reportNonMatchingComponentName(
                list[component],
                decamelize(list[component].name),
                filenameWithoutExtension);
            }
          }
        }
      }
    };
  })
};
