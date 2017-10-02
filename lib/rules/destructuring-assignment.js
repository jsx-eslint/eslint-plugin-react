/**
 * @fileoverview Enforce consostent usage of destructuring assignment of props, state and context.
 **/
'use strict';

const Components = require('../util/Components');

const DEFAULT_OPTIONS = {
  SFC: 'always',
  class: 'always'
};

module.exports = {
  meta: {
    docs: {
      description: 'Enforce consostent usage of destructuring assignment of props, state and context',
      category: 'Stylistic Issues',
      recommended: false
    },
    schema: [{
      definitions: {
        valueSFC: {
          enum: [
            'always',
            'never',
            'ignore'
          ]
        },
        valueClass: {
          enum: [
            'always',
            'ignore'
          ]
        }
      },
      type: 'object',
      properties: {
        SFC: {$ref: '#/definitions/valueSFC'},
        class: {$ref: '#/definitions/valueClass'}
      },
      additionalProperties: false
    }]
  },

  create: Components.detect((context, components, utils) => {
    const configuration = context.options[0] || {};
    const options = {
      SFC: configuration.SFC || DEFAULT_OPTIONS.SFC,
      class: configuration.class || DEFAULT_OPTIONS.class
    };


    /**
    * Checks if a prop is being assigned a value props.bar = 'bar'
    * @param {ASTNode} node The AST node being checked.
    * @returns {Boolean}
    */

    function isAssignmentToProp(node) {
      return (
        node.parent &&
        node.parent.type === 'AssignmentExpression' &&
        node.parent.left === node
      );
    }
    /**
     * @param {ASTNode} node We expect either an ArrowFunctionExpression,
     *   FunctionDeclaration, or FunctionExpression
     */
    function handleStatelessComponent(node) {
      const destructuringProps = node.params && node.params[0] && node.params[0].type === 'ObjectPattern';
      const destructuringContext = node.params && node.params[1] && node.params[1].type === 'ObjectPattern';

      if (destructuringProps && components.get(node) && options.SFC === 'never') {
        context.report({
          node: node,
          message: 'Must never use destructuring props assignment in SFC argument'
        });
      } else if (destructuringContext && components.get(node) && options.SFC === 'never') {
        context.report({
          node: node,
          message: 'Must never use destructuring context assignment in SFC argument'
        });
      }
    }

    function handleSFCUsage(node) {
      // props.aProp || context.aProp
      const isPropUsed = (node.object.name === 'props' || node.object.name === 'context') && !isAssignmentToProp(node);
      if (isPropUsed && options.SFC === 'always') {
        context.report({
          node: node,
          message: `Must use destructuring ${node.object.name} assignment`
        });
      }
    }

    function handleClassUsage(node) {
      // this.props.Aprop || this.context.aProp || this.state.aState
      const isPropUsed = (node.object.type === 'MemberExpression' && node.object.object.type === 'ThisExpression' &&
        (node.object.property.name === 'props' || node.object.property.name === 'context' || node.object.property.name === 'state') &&
        node.object.type === 'MemberExpression'
      );

      if (isPropUsed && options.class === 'always') {
        context.report({
          node: node,
          message: `Must use destructuring ${node.object.property.name} assignment`
        });
      }
    }

    return {

      FunctionDeclaration: handleStatelessComponent,

      ArrowFunctionExpression: handleStatelessComponent,

      FunctionExpression: handleStatelessComponent,

      MemberExpression: function(node) {
        const SFCComponent = components.get(context.getScope(node).block);
        const classComponent = utils.getParentComponent(node);
        if (SFCComponent) {
          handleSFCUsage(node);
        }
        if (classComponent) {
          handleClassUsage(node, classComponent);
        }
      }
    };
  })
};
