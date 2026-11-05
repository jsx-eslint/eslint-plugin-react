/**
 * @fileoverview Prevent usage of dangerous JSX props
 * @author Scott Andrews
 */

'use strict';

const has = require('hasown');
const fromEntries = require('object.fromentries/polyfill')();
const minimatch = require('minimatch');

const docsUrl = require('../util/docsUrl');
const isCreateElement = require('../util/isCreateElement');
const jsxUtil = require('../util/jsx');
const report = require('../util/report');
const getSourceCode = require('../util/eslint').getSourceCode;

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
 * @param {string} name - Name of the attribute to check.
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

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Disallow usage of dangerous React properties',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-danger'),
    },

    messages,

    schema: [{
      type: 'object',
      properties: {
        customComponentNames: {
          items: {
            type: 'string',
          },
          minItems: 0,
          type: 'array',
          uniqueItems: true,
        },
      },
    }],
  },

  create(context) {
    const configuration = context.options[0] || {};
    const customComponentNames = configuration.customComponentNames || [];

    return {
      CallExpression(node) {
        if (
          !isCreateElement(context, node)
          || node.arguments.length < 2
          || node.arguments[1].type !== 'ObjectExpression'
        ) {
          return;
        }

        const element = node.arguments[0];
        const isDOMElement = element.type === 'Literal' && typeof element.value === 'string';
        const componentName = customComponentNames.length > 0
          ? getSourceCode(context).getTokens(element).map((token) => token.value).join('')
          : '';
        const enableCheckingCustomComponent = customComponentNames.some((name) => minimatch(componentName, name));

        if (!isDOMElement && !enableCheckingCustomComponent) {
          return;
        }

        node.arguments[1].properties.forEach((property) => {
          if (property.type !== 'Property') {
            return;
          }

          const name = property.key.type === 'Literal'
            ? property.key.value
            : !property.computed && property.key.type === 'Identifier' && property.key.name;

          if (typeof name === 'string' && isDangerous(name)) {
            report(context, messages.dangerousProp, 'dangerousProp', {
              node: property,
              data: { name },
            });
          }
        });
      },
      JSXAttribute(node) {
        const nodeName = node.parent.name;
        const functionName = nodeName.name || `${nodeName.object.name}.${nodeName.property.name}`;

        const enableCheckingCustomComponent = customComponentNames.some((name) => minimatch(functionName, name));

        if ((enableCheckingCustomComponent || jsxUtil.isDOMComponent(node.parent)) && isDangerous(node.name.name)) {
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
