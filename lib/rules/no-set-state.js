/**
 * @fileoverview Prevent usage of setState
 * @author Mark Dalgleish
 */

'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent usage of setState',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('no-set-state')
    },
    schema: [
      {
        type: 'object',
        properties: {
          in: {
            type: 'array',
            items: {
              type: 'string',
              minLength: 1
            },
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ]
  },

  create: Components.detect((context, components, utils) => {
    /**
     * Checks if the component is valid
     * @param {Object} component The component to process
     * @returns {Boolean} True if the component is valid, false if not.
     */

    const configuration = context.options[0] || {};
    const notAllowedIn = new Set(configuration.in);

    function isValid(component) {
      return Boolean(component && !component.useSetState);
    }

    function getMethodName(node) {
      let parent = node.parent;
      while (parent) {
        if ((parent.type === 'ClassProperty' && parent.value.type === 'ArrowFunctionExpression') ||
          (parent.type === 'Property' && parent.value.type === 'FunctionExpression') ||
          (parent.type === 'MethodDefinition')
        ) {
          return parent.key.name;
        }
        parent = parent.parent;
      }
      return null;
    }

    /**
     * Reports usages of setState for a given component
     * @param {Object} component The component to process
     */
    function reportSetStateUsages(component) {
      let setStateUsage;
      let calleeName;
      const calleeNames = component.setStateUsages.map(node => getMethodName(node));
      for (let i = 0, j = component.setStateUsages.length; i < j; i++) {
        calleeName = calleeNames[i];
        setStateUsage = component.setStateUsages[i];
        const reportUsage = notAllowedIn.size === 0 || notAllowedIn.has(calleeName);
        if (reportUsage) {
          context.report({
            node: setStateUsage,
            message: 'Do not use setState'
          });
        }
      }
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      CallExpression(node) {
        const callee = node.callee;
        if (
          callee.type !== 'MemberExpression' ||
          callee.object.type !== 'ThisExpression' ||
          callee.property.name !== 'setState'
        ) {
          return;
        }
        const component = components.get(utils.getParentComponent());
        const setStateUsages = component && component.setStateUsages || [];
        setStateUsages.push(callee);
        components.set(node, {
          useSetState: true,
          setStateUsages
        });
      },

      'Program:exit': function () {
        const list = components.list();
        Object.keys(list).filter(component => !isValid(list[component])).forEach((component) => {
          reportSetStateUsages(list[component]);
        });
      }
    };
  })
};
