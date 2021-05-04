/**
 * @fileOverview Enforce a defaultProps definition for every prop that is not a required prop.
 * @author Vitor Balocco
 */

'use strict';

const entries = require('object.entries');
const values = require('object.values');
const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const astUtil = require('../util/ast');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce a defaultProps definition for every prop that is not a required prop.',
      category: 'Best Practices',
      url: docsUrl('require-default-props')
    },

    messages: {
      noDefaultWithRequired: 'propType "{{name}}" is required and should not have a defaultProps declaration.',
      shouldHaveDefault: 'propType "{{name}}" is not required, but has no corresponding defaultProps declaration.'
    },

    schema: [{
      type: 'object',
      properties: {
        forbidDefaultForRequired: {
          type: 'boolean'
        },
        ignoreFunctionalComponents: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: Components.detect((context, components) => {
    const configuration = context.options[0] || {};
    const forbidDefaultForRequired = configuration.forbidDefaultForRequired || false;
    const ignoreFunctionalComponents = configuration.ignoreFunctionalComponents || false;

    /**
     * Reports all propTypes passed in that don't have a defaultProps counterpart.
     * @param  {Object[]} propTypes    List of propTypes to check.
     * @param  {Object}   defaultProps Object of defaultProps to check. Keys are the props names.
     * @return {void}
     */
    function reportPropTypesWithoutDefault(propTypes, defaultProps) {
      // If this defaultProps is "unresolved", then we should ignore this component and not report
      // any errors for it, to avoid false-positives with e.g. external defaultProps declarations or spread operators.
      if (defaultProps === 'unresolved') {
        return;
      }

      entries(propTypes).forEach((propEntry) => {
        const propName = propEntry[0];
        const prop = propEntry[1];
        if (prop.isRequired) {
          if (forbidDefaultForRequired && defaultProps[propName]) {
            context.report({
              node: prop.node,
              messageId: 'noDefaultWithRequired',
              data: {name: propName}
            });
          }
          return;
        }

        if (defaultProps[propName]) {
          return;
        }

        context.report({
          node: prop.node,
          messageId: 'shouldHaveDefault',
          data: {name: propName}
        });
      });
    }

    // --------------------------------------------------------------------------
    // Public API
    // --------------------------------------------------------------------------

    return {
      'Program:exit'() {
        const list = components.list();

        values(list).forEach((component) => {
          if (ignoreFunctionalComponents
            && (astUtil.isFunction(component.node) || astUtil.isFunctionLikeExpression(component.node))) {
            return;
          }
          if (component.declaredPropTypes) {
            reportPropTypesWithoutDefault(
              component.declaredPropTypes,
              component.defaultProps || {}
            );
          }
        });
      }
    };
  })
};
