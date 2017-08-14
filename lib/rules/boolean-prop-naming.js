/**
 * @fileoverview Enforces consistent naming for boolean props
 * @author Ev Haus
 */
'use strict';

const has = require('has');
const Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'Enforces consistent naming for boolean props',
      recommended: false
    },

    schema: [{
      additionalProperties: false,
      properties: {
        propTypeNames: {
          items: {
            type: 'string'
          },
          minItems: 1,
          type: 'array',
          uniqueItems: true
        },
        rule: {
          default: '^(is|has)[A-Z]([A-Za-z0-9]?)+',
          minLength: 1,
          type: 'string'
        }
      },
      type: 'object'
    }]
  },

  create: Components.detect((context, components, utils) => {
    const sourceCode = context.getSourceCode();
    const config = context.options[0] || {};
    const rule = config.rule ? new RegExp(config.rule) : null;
    const propTypeNames = config.propTypeNames || ['bool'];

    // Remembers all Flowtype object definitions
    const objectTypeAnnotations = new Map();

    /**
     * Checks if node is `propTypes` declaration
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if node is `propTypes` declaration, false if not.
     */
    function isPropTypesDeclaration(node) {
      // Special case for class properties
      // (babel-eslint does not expose property name so we have to rely on tokens)
      if (node && node.type === 'ClassProperty') {
        const tokens = context.getFirstTokens(node, 2);
        if (tokens[0].value === 'propTypes' || (tokens[1] && tokens[1].value === 'propTypes')) {
          return true;
        }
        // Flow support
        if (node.typeAnnotation && node.key.name === 'props') {
          return true;
        }
        return false;
      }

      return Boolean(
        node &&
        node.name === 'propTypes'
      );
    }

    /**
     * Returns the prop key to ensure we handle the following cases:
     * propTypes: {
     *   full: React.PropTypes.bool,
     *   short: PropTypes.bool,
     *   direct: bool
     * }
     * @param {Object} node The node we're getting the name of
     */
    function getPropKey(node) {
      if (node.value.property) {
        return node.value.property.name;
      }
      if (node.value.type === 'Identifier') {
        return node.value.name;
      }
      return null;
    }

    /**
	 * Returns the name of the given node (prop)
	 * @param {Object} node The node we're getting the name of
	 */
    function getPropName(node) {
      // Due to this bug https://github.com/babel/babel-eslint/issues/307
      // we can't get the name of the Flow object key name. So we have
      // to hack around it for now.
      if (node.type === 'ObjectTypeProperty') {
        return sourceCode.getFirstToken(node).value;
      }

      return node.key.name;
    }

    /**
     * Checks and mark props with invalid naming
     * @param {Object} node The component node we're testing
     * @param {Array} proptypes A list of Property object (for each proptype defined)
     */
    function validatePropNaming(node, proptypes) {
      const component = components.get(node) || node;
      const invalidProps = component.invalidProps || [];

      proptypes.forEach(prop => {
        const propKey = getPropKey(prop);
        const flowCheck = (
          prop.type === 'ObjectTypeProperty' &&
          prop.value.type === 'BooleanTypeAnnotation' &&
          rule.test(getPropName(prop)) === false
        );
        const regularCheck = (
          propKey &&
          propTypeNames.indexOf(propKey) >= 0 &&
          rule.test(getPropName(prop)) === false
        );

        if (flowCheck || regularCheck) {
          invalidProps.push(prop);
        }
      });

      components.set(node, {
        invalidProps: invalidProps
      });
    }

    /**
     * Reports invalid prop naming
     * @param {Object} component The component to process
     */
    function reportInvalidNaming(component) {
      component.invalidProps.forEach(propNode => {
        const propName = getPropName(propNode);
        context.report({
          node: propNode,
          message: `Prop name (${propName}) doesn't match rule (${config.rule})`,
          data: {
            component: propName
          }
        });
      });
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      ClassProperty: function(node) {
        if (!rule || !isPropTypesDeclaration(node)) {
          return;
        }
        if (node.value && node.value.properties) {
          validatePropNaming(node, node.value.properties);
        }
        if (node.typeAnnotation && node.typeAnnotation.typeAnnotation) {
          validatePropNaming(node, node.typeAnnotation.typeAnnotation.properties);
        }
      },

      MemberExpression: function(node) {
        if (!rule || !isPropTypesDeclaration(node.property)) {
          return;
        }
        const component = utils.getRelatedComponent(node);
        if (!component || !node.parent.right.properties) {
          return;
        }
        validatePropNaming(component.node, node.parent.right.properties);
      },

      ObjectExpression: function(node) {
        if (!rule) {
          return;
        }

        // Search for the proptypes declaration
        node.properties.forEach(property => {
          if (!isPropTypesDeclaration(property.key)) {
            return;
          }
          validatePropNaming(node, property.value.properties);
        });
      },

      TypeAlias: function(node) {
        // Cache all ObjectType annotations, we will check them at the end
        if (node.right.type === 'ObjectTypeAnnotation') {
          objectTypeAnnotations.set(node.id.name, node.right);
        }
      },

      'Program:exit': function() {
        if (!rule) {
          return;
        }

        const list = components.list();
        Object.keys(list).forEach(component => {
          // If this is a functional component that uses a global type, check it
          if (
            list[component].node.type === 'FunctionDeclaration' &&
            list[component].node.params &&
            list[component].node.params.length &&
            list[component].node.params[0].typeAnnotation
          ) {
            const typeNode = list[component].node.params[0].typeAnnotation;
            const propType = objectTypeAnnotations.get(typeNode.typeAnnotation.id.name);
            if (propType) {
              validatePropNaming(list[component].node, propType.properties);
            }
          }

          if (!has(list, component) || (list[component].invalidProps || []).length) {
            reportInvalidNaming(list[component]);
          }
        });

        // Reset cache
        objectTypeAnnotations.clear();
      }
    };
  })
};
