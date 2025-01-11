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

/** @typedef {{ disallowList: null | string[]; message: null | string; valueRegex: null | RegExp }} ForbidMapType */
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
    !options.valueRegex
    || options.valueRegex.test(propValue)
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
                valueRegex: {
                  type: 'string',
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
        message: typeof value === 'string' ? null : value.message,
        valueRegex: typeof value.valueRegex === 'string' ? new RegExp(value.valueRegex) : null,
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
        const isRegexSpecified = forbid.get(prop).valueRegex !== null;
        const message = customMessage || (isRegexSpecified && messages.propIsForbiddenWithValue) || messages.propIsForbidden;
        const messageId = !customMessage && ((isRegexSpecified && 'propIsForbiddenWithValue') || 'propIsForbidden');

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
