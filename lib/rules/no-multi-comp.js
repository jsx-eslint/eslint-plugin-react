/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */

'use strict';

const values = require('object.values');
const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent multiple component definition per file',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('no-multi-comp')
    },

    messages: {
      onlyOneComponent: 'Declare only one React component per file'
    },

    schema: [{
      type: 'object',
      properties: {
        ignoreStateless: {
          default: false,
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: Components.detect((context, components, utils) => {
    const configuration = context.options[0] || {};
    const ignoreStateless = configuration.ignoreStateless || false;

    /**
     * Checks if the component is ignored
     * @param {Object} component The component being checked.
     * @returns {Boolean} True if the component is ignored, false if not.
     */
    function isIgnored(component) {
      return (
        ignoreStateless && (
          /Function/.test(component.node.type)
          || utils.isPragmaComponentWrapper(component.node)
        )
      );
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      'Program:exit'() {
        if (components.length() <= 1) {
          return;
        }

        const list = components.list();

        values(list).filter((component) => !isIgnored(component)).forEach((component, i) => {
          if (i >= 1) {
            context.report({
              node: component.node,
              messageId: 'onlyOneComponent'
            });
          }
        });
      }
    };
  })
};
