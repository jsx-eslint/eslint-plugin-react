/**
 * @fileoverview Prevent usage of dangerous JSX props
 * @author Scott Andrews
 */

'use strict';

const has = require('object.hasown/polyfill')();
const fromEntries = require('object.fromentries/polyfill')();

const docsUrl = require('../util/docsUrl');
const jsxUtil = require('../util/jsx');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const DANGEROUS_PROPERTY_NAMES = [
  'dangerouslySetInnerHTML',
];

const DANGEROUS_PROPERTIES = fromEntries(DANGEROUS_PROPERTY_NAMES.map((prop) => [prop, prop]));

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Checks if a JSX attribute is dangerous.
 * @param {String} name - Name of the attribute to check.
 * @returns {boolean} Whether or not the attribute is dangerous.
 */
function isDangerous(name) {
  return has(DANGEROUS_PROPERTIES, name);
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  dangerousProp: 'Dangerous property \'{{name}}\' found',
};

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow usage of dangerous JSX properties',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-danger'),
    },

    messages,

    schema: [],
  },

  create(context) {
    return {
      JSXAttribute(node) {
        if (jsxUtil.isDOMComponent(node.parent) && isDangerous(node.name.name)) {
          report(context, messages.dangerousProp, 'dangerousProp', {
            node,
            data: {
              name: node.name.name,
            },
          });
        }
      },
    };
  },
};
