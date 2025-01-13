/**
 * @fileoverview Forbid certain props on DOM Nodes
 * @author David Vázquez
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const DEFAULTS = [];

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @typedef {{ disallowList: null | string[]; message: null | string; disallowedValues: string[] | null }} ForbidMapType */
/**
 * @param {Map<string, ForbidMapType>} forbidMap
 * @param {string} prop
 * @param {string} propValue
 * @param {string} tagName
 * @returns {boolean}
 */
function isForbidden(forbidMap, prop, propValue, tagName) {
  const options = forbidMap.get(prop);

  if (!options) {
    return false;
  }

  return (
    !options.disallowList
    || options.disallowList.indexOf(tagName) !== -1
  ) && (
    !options.disallowedValues
    || options.disallowedValues.indexOf(propValue) !== -1
  );
}

const messages = {
  propIsForbidden: 'Prop "{{prop}}" is forbidden on DOM Nodes',
  propIsForbiddenWithValue: 'Prop "{{prop}}" with value "{{propValue}}" is forbidden on DOM Nodes',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Disallow certain props on DOM Nodes',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('forbid-dom-props'),
    },

    messages,

    schema: [{
      type: 'object',
      properties: {
        forbid: {
          type: 'array',
          items: {
            anyOf: [{
              type: 'string',
            }, {
              type: 'object',
              properties: {
                propName: {
                  type: 'string',
                },
                disallowedFor: {
                  type: 'array',
                  uniqueItems: true,
                  items: {
                    type: 'string',
                  },
                },
                disallowedValues: {
                  type: 'array',
                  uniqueItems: true,
                  items: {
                    type: 'string',
                  },
                },
                message: {
                  type: 'string',
                },
              },
            }],
            minLength: 1,
          },
          uniqueItems: true,
        },
      },
      additionalProperties: false,
    }],
  },

  create(context) {
    const configuration = context.options[0] || {};
    const forbid = new Map((configuration.forbid || DEFAULTS).map((value) => {
      const propName = typeof value === 'string' ? value : value.propName;
      return [propName, {
        disallowList: typeof value === 'string' ? null : (value.disallowedFor || null),
        disallowedValues: typeof value === 'string' ? null : (value.disallowedValues || null),
        message: typeof value === 'string' ? null : value.message,
      }];
    }));

    return {
      JSXAttribute(node) {
        const tag = node.parent.name.name;
        if (!(tag && typeof tag === 'string' && tag[0] !== tag[0].toUpperCase())) {
          // This is a Component, not a DOM node, so exit.
          return;
        }

        const prop = node.name.name;
        const propValue = node.value.value;

        if (!isForbidden(forbid, prop, propValue, tag)) {
          return;
        }

        const customMessage = forbid.get(prop).message;
        const isValuesListSpecified = forbid.get(prop).disallowedValues !== null;
        const message = customMessage || (isValuesListSpecified && messages.propIsForbiddenWithValue) || messages.propIsForbidden;
        const messageId = !customMessage && ((isValuesListSpecified && 'propIsForbiddenWithValue') || 'propIsForbidden');

        report(context, message, messageId, {
          node,
          data: {
            prop,
            propValue,
          },
        });
      },
    };
  },
};
