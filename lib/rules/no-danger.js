/**
 * @fileoverview Prevent usage of dangerous JSX props
 * @author Scott Andrews
 */

'use strict';

const has = require('hasown');
const fromEntries = require('object.fromentries/polyfill')();
const minimatch = require('minimatch');

const docsUrl = require('../util/docsUrl');
const jsxUtil = require('../util/jsx');
const report = require('../util/report');
const variableUtil = require('../util/variable');
const getText = require('../util/eslint').getText;
const isCreateElement = require('../util/isCreateElement');

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
      description: 'Disallow usage of dangerous JSX properties',
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

    function findSpreadVariable(node, name) {
      return variableUtil.getVariableFromContext(context, node, name);
    }

    function findDangerousProperty(node, seenProps) {
      if (!node) {
        return false;
      }
      if (node.type === 'Identifier') {
        const variable = findSpreadVariable(node, node.name);
        if (variable && variable.defs.length && variable.defs[0].node.init) {
          return findDangerousProperty(variable.defs[0].node.init, seenProps);
        }
      }
      if (!node.properties) {
        return false;
      }
      return node.properties.find((prop) => {
        if (prop.type === 'Property') {
          const name = prop.key.type === 'Identifier' ? prop.key.name : prop.key.value;
          return prop.key && !prop.computed && isDangerous(name);
        }
        if (prop.type === 'ExperimentalSpreadProperty' || prop.type === 'SpreadElement') {
          if (prop.argument && prop.argument.type === 'Identifier') {
            const variable = findSpreadVariable(node, prop.argument.name);
            if (variable && variable.defs.length && variable.defs[0].node.init) {
              if (seenProps.indexOf(prop.argument.name) > -1) {
                return false;
              }
              const newSeenProps = seenProps.concat(prop.argument.name || []);
              return findDangerousProperty(variable.defs[0].node.init, newSeenProps);
            }
          }
        }
        return false;
      });
    }

    return {
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

      CallExpression(node) {
        if (
          isCreateElement(context, node)
          && node.arguments.length > 0
        ) {
          const typeNode = node.arguments[0];
          let isDOMComponent = false;
          let elementName = '';

          if (typeNode.type === 'Literal' && typeof typeNode.value === 'string') {
            elementName = typeNode.value;
            isDOMComponent = /^[a-z]/.test(elementName);
          } else if (typeNode.type === 'Identifier') {
            elementName = typeNode.name;
          } else if (typeNode.type === 'MemberExpression') {
            elementName = getText(context, typeNode);
          }

          const enableCheckingCustomComponent = customComponentNames.some((name) => minimatch(elementName, name));

          if (enableCheckingCustomComponent || isDOMComponent) {
            const dangerously = findDangerousProperty(node.arguments[1], []);
            if (dangerously) {
              report(context, messages.dangerousProp, 'dangerousProp', {
                node: dangerously,
                data: {
                  name: dangerously.key.type === 'Identifier' ? dangerously.key.name : dangerously.key.value,
                },
              });
            }
          }
        }
      },
    };
  },
};
