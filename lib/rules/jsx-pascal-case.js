/**
 * @fileoverview Enforce PascalCase for user-defined JSX components
 * @author Jake Marsh
 */

'use strict';

const elementType = require('jsx-ast-utils/elementType');
const XRegExp = require('xregexp');
const docsUrl = require('../util/docsUrl');
const jsxUtil = require('../util/jsx');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

// eslint-disable-next-line no-new
const hasU = (function hasU() { try { new RegExp('o', 'u'); return true; } catch (e) { return false; } }());

const PASCAL_CASE_REGEX = XRegExp('^(.*[.])*([\\p{Lu}]|[\\p{Lu}]+[\\p{Ll}0-9]+(?:[\\p{Lu}0-9]+[\\p{Ll}0-9]*)*)$', hasU ? 'u' : '');
const ALL_CAPS_TAG_REGEX = XRegExp('^[\\p{Lu}0-9]+([\\p{Lu}0-9_]*[\\p{Lu}0-9]+)?$', hasU ? 'u' : '');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce PascalCase for user-defined JSX components',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-pascal-case')
    },

    schema: [{
      type: 'object',
      properties: {
        allowAllCaps: {
          type: 'boolean'
        },
        ignore: {
          type: 'array'
        }
      },
      additionalProperties: false
    }]
  },

  create(context) {
    const configuration = context.options[0] || {};
    const allowAllCaps = configuration.allowAllCaps || false;
    const ignore = configuration.ignore || [];

    return {
      JSXOpeningElement(node) {
        const isCompatTag = jsxUtil.isDOMComponent(node);
        if (isCompatTag) return undefined;

        let name = elementType(node);
        if (name.length === 1) return undefined;

        // Get JSXIdentifier if the type is JSXNamespacedName or JSXMemberExpression
        if (name.lastIndexOf(':') > -1) {
          name = name.substring(name.lastIndexOf(':') + 1);
        } else if (name.lastIndexOf('.') > -1) {
          name = name.substring(name.lastIndexOf('.') + 1);
        }

        const isPascalCase = PASCAL_CASE_REGEX.test(name);
        const isAllowedAllCaps = allowAllCaps && ALL_CAPS_TAG_REGEX.test(name);
        const isIgnored = ignore.indexOf(name) !== -1;

        if (!isPascalCase && !isAllowedAllCaps && !isIgnored) {
          let message = `Imported JSX component ${name} must be in PascalCase`;

          if (allowAllCaps) {
            message += ' or SCREAMING_SNAKE_CASE';
          }

          context.report({node, message});
        }
      }
    };
  }
};
