/**
 * @fileoverview Check if tag attributes to have non-valid value
 * @author Sebastian Malton
 */

'use strict';

const matchAll = require('string.prototype.matchall');
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const rel = new Map([
  ['alternate', new Set(['link', 'area', 'a'])],
  ['author', new Set(['link', 'area', 'a'])],
  ['bookmark', new Set(['area', 'a'])],
  ['canonical', new Set(['link'])],
  ['dns-prefetch', new Set(['link'])],
  ['external', new Set(['area', 'a', 'form'])],
  ['help', new Set(['link', 'area', 'a', 'form'])],
  ['icon', new Set(['link'])],
  ['license', new Set(['link', 'area', 'a', 'form'])],
  ['manifest', new Set(['link'])],
  ['modulepreload', new Set(['link'])],
  ['next', new Set(['link', 'area', 'a', 'form'])],
  ['nofollow', new Set(['area', 'a', 'form'])],
  ['noopener', new Set(['area', 'a', 'form'])],
  ['noreferrer', new Set(['area', 'a', 'form'])],
  ['opener', new Set(['area', 'a', 'form'])],
  ['pingback', new Set(['link'])],
  ['preconnect', new Set(['link'])],
  ['prefetch', new Set(['link'])],
  ['preload', new Set(['link'])],
  ['prerender', new Set(['link'])],
  ['prev', new Set(['link', 'area', 'a', 'form'])],
  ['search', new Set(['link', 'area', 'a', 'form'])],
  ['stylesheet', new Set(['link'])],
  ['tag', new Set(['area', 'a'])],
]);

/**
 * Map between attributes and a mapping between valid values and a set of tags they are valid on
 * @type {Map<string, Map<string, Set<string>>>}
 */
const VALID_VALUES = new Map([
  ['rel', rel],
]);

/**
 * The set of all possible HTML elements. Used for skipping custom types
 * @type {Set<string>}
 */
const HTML_ELEMENTS = new Set([
  'html',
  'base',
  'head',
  'link',
  'meta',
  'style',
  'title',
  'body',
  'address',
  'article',
  'aside',
  'footer',
  'header',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'main',
  'nav',
  'section',
  'blockquote',
  'dd',
  'div',
  'dl',
  'dt',
  'figcaption',
  'figure',
  'hr',
  'li',
  'ol',
  'p',
  'pre',
  'ul',
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'br',
  'cite',
  'code',
  'data',
  'dfn',
  'em',
  'i',
  'kbd',
  'mark',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
  'wbr',
  'area',
  'audio',
  'img',
  'map',
  'track',
  'video',
  'embed',
  'iframe',
  'object',
  'param',
  'picture',
  'portal',
  'source',
  'svg',
  'math',
  'canvas',
  'noscript',
  'script',
  'del',
  'ins',
  'caption',
  'col',
  'colgroup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'button',
  'datalist',
  'fieldset',
  'form',
  'input',
  'label',
  'legend',
  'meter',
  'optgroup',
  'option',
  'output',
  'progress',
  'select',
  'textarea',
  'details',
  'dialog',
  'menu',
  'summary',
  'slot',
  'template',
  'acronym',
  'applet',
  'basefont',
  'bgsound',
  'big',
  'blink',
  'center',
  'content',
  'dir',
  'font',
  'frame',
  'frameset',
  'hgroup',
  'image',
  'keygen',
  'marquee',
  'menuitem',
  'nobr',
  'noembed',
  'noframes',
  'plaintext',
  'rb',
  'rtc',
  'shadow',
  'spacer',
  'strike',
  'tt',
  'xmp',
]);

/**
* Map between attributes and set of tags that the attribute is valid on
* @type {Map<string, Set<string>>}
*/
const COMPONENT_ATTRIBUTE_MAP = new Map();
COMPONENT_ATTRIBUTE_MAP.set('rel', new Set(['link', 'a', 'area', 'form']));

const messages = {
  onlyStrings: '“{{attributeName}}” attribute only supports strings.',
  noEmpty: 'An empty “{{attributeName}}” attribute is meaningless.',
  neverValid: '“{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.',
  notValidFor: '“{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.',
  spaceDelimited: '”{{attributeName}}“ attribute values should be space delimited.',
  noMethod: 'The ”{{attributeName}}“ attribute cannot be a method.',
  onlyMeaningfulFor: 'The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}',
  emptyIsMeaningless: 'An empty “{{attributeName}}” attribute is meaningless.',
};

function splitIntoRangedParts(node, regex) {
  const valueRangeStart = node.range[0] + 1; // the plus one is for the initial quote

  return Array.from(matchAll(node.value, regex), (match) => {
    const start = match.index + valueRangeStart;
    const end = start + match[0].length;

    return {
      reportingValue: `${match[1]}`,
      value: match[1],
      range: [start, end],
    };
  });
}

function checkLiteralValueNode(context, attributeName, node, parentNode, parentNodeName) {
  if (typeof node.value !== 'string') {
    report(context, messages.onlyStrings, 'onlyStrings', {
      node,
      data: { attributeName },
      fix(fixer) {
        return fixer.remove(parentNode);
      },
    });
    return;
  }

  if (!node.value.trim()) {
    report(context, messages.noEmpty, 'noEmpty', {
      node,
      data: { attributeName },
      fix(fixer) {
        return fixer.remove(parentNode);
      },
    });
    return;
  }

  const parts = splitIntoRangedParts(node, /([^\s]+)/g);
  for (const part of parts) {
    const allowedTags = VALID_VALUES.get(attributeName).get(part.value);
    const reportingValue = part.reportingValue;
    if (!allowedTags) {
      report(context, messages.neverValid, 'neverValid', {
        node,
        data: {
          attributeName,
          reportingValue,
        },
        fix(fixer) {
          return fixer.removeRange(part.range);
        },
      });
    } else if (!allowedTags.has(parentNodeName)) {
      report(context, messages.notValidFor, 'notValidFor', {
        node,
        data: {
          attributeName,
          reportingValue,
          elementName: parentNodeName,
        },
        fix(fixer) {
          return fixer.removeRange(part.range);
        },
      });
    }
  }

  const whitespaceParts = splitIntoRangedParts(node, /(\s+)/g);
  for (const whitespacePart of whitespaceParts) {
    if (whitespacePart.value !== ' ' || whitespacePart.range[0] === (node.range[0] + 1) || whitespacePart.range[1] === (node.range[1] - 1)) {
      report(context, messages.spaceDelimited, 'spaceDelimited', {
        node,
        data: { attributeName },
        fix(fixer) {
          return fixer.removeRange(whitespacePart.range);
        },
      });
    }
  }
}

const DEFAULT_ATTRIBUTES = ['rel'];

function checkAttribute(context, node) {
  const attribute = node.name.name;

  function fix(fixer) {
    return fixer.remove(node);
  }

  const parentNodeName = node.parent.name.name;
  if (!COMPONENT_ATTRIBUTE_MAP.has(attribute) || !COMPONENT_ATTRIBUTE_MAP.get(attribute).has(parentNodeName)) {
    const tagNames = Array.from(
      COMPONENT_ATTRIBUTE_MAP.get(attribute).values(),
      (tagName) => `"<${tagName}>"`
    ).join(', ');
    report(context, messages.onlyMeaningfulFor, 'onlyMeaningfulFor', {
      node,
      data: {
        attributeName: attribute,
        tagNames,
      },
      fix,
    });
    return;
  }

  if (!node.value) {
    report(context, messages.emptyIsMeaningless, 'emptyIsMeaningless', {
      node,
      data: { attributeName: attribute },
      fix,
    });
    return;
  }

  if (node.value.type === 'Literal') {
    return checkLiteralValueNode(context, attribute, node.value, node, parentNodeName);
  }

  if (node.value.expression.type === 'Literal') {
    return checkLiteralValueNode(context, attribute, node.value.expression, node, parentNodeName);
  }

  if (node.value.type !== 'JSXExpressionContainer') {
    return;
  }

  if (node.value.expression.type === 'ObjectExpression') {
    report(context, messages.onlyStrings, 'onlyStrings', {
      node,
      data: { attributeName: attribute },
      fix,
    });
    return;
  }

  if (node.value.expression.type === 'Identifier' && node.value.expression.name === 'undefined') {
    report(context, messages.onlyStrings, 'onlyStrings', {
      node,
      data: { attributeName: attribute },
      fix,
    });
  }
}

function isValidCreateElement(node) {
  return node.callee
    && node.callee.type === 'MemberExpression'
    && node.callee.object.name === 'React'
    && node.callee.property.name === 'createElement'
    && node.arguments.length > 0;
}

function checkPropValidValue(context, node, value, attribute) {
  const validTags = VALID_VALUES.get(attribute);

  if (value.type !== 'Literal') {
    return; // cannot check non-literals
  }

  const validTagSet = validTags.get(value.value);
  if (!validTagSet) {
    report(context, messages.neverValid, 'neverValid', {
      node: value,
      data: {
        attributeName: attribute,
        reportingValue: value.value,
      },
    });
    return;
  }

  if (!validTagSet.has(node.arguments[0].value)) {
    report(context, messages.notValidFor, 'notValidFor', {
      node: value,
      data: {
        attributeName: attribute,
        reportingValue: value.raw,
        elementName: node.arguments[0].value,
      },
    });
  }
}

/**
 *
 * @param {*} context
 * @param {*} node
 * @param {string} attribute
 */
function checkCreateProps(context, node, attribute) {
  const propsArg = node.arguments[1];

  if (!propsArg || propsArg.type !== 'ObjectExpression') {
    return; // can't check variables, computed, or shorthands
  }

  for (const prop of propsArg.properties) {
    if (!prop.key || prop.key.type !== 'Identifier') {
      // eslint-disable-next-line no-continue
      continue; // cannot check computed keys
    }

    if (prop.key.name !== attribute) {
      // eslint-disable-next-line no-continue
      continue; // ignore not this attribute
    }

    if (!COMPONENT_ATTRIBUTE_MAP.get(attribute).has(node.arguments[0].value)) {
      const tagNames = Array.from(
        COMPONENT_ATTRIBUTE_MAP.get(attribute).values(),
        (tagName) => `"<${tagName}>"`
      ).join(', ');

      report(context, messages.onlyMeaningfulFor, 'onlyMeaningfulFor', {
        node,
        data: {
          attributeName: attribute,
          tagNames,
        },
      });

      // eslint-disable-next-line no-continue
      continue;
    }

    if (prop.method) {
      report(context, messages.noMethod, 'noMethod', {
        node: prop,
        data: {
          attributeName: attribute,
        },
      });

      // eslint-disable-next-line no-continue
      continue;
    }

    if (prop.shorthand || prop.computed) {
      // eslint-disable-next-line no-continue
      continue; // cannot check these
    }

    if (prop.value.type === 'ArrayExpression') {
      for (const value of prop.value.elements) {
        checkPropValidValue(context, node, value, attribute);
      }

      // eslint-disable-next-line no-continue
      continue;
    }

    checkPropValidValue(context, node, prop.value, attribute);
  }
}

module.exports = {
  meta: {
    fixable: 'code',
    docs: {
      description: 'Forbid attribute with an invalid values`',
      category: 'Possible Errors',
      url: docsUrl('no-invalid-html-attribute'),
    },
    messages,
    schema: [{
      type: 'array',
      uniqueItems: true,
      items: {
        enum: ['rel'],
      },
    }],
  },

  create(context) {
    return {
      JSXAttribute(node) {
        const attributes = new Set(context.options[0] || DEFAULT_ATTRIBUTES);

        // ignore attributes that aren't configured to be checked
        if (!attributes.has(node.name.name)) {
          return;
        }

        // ignore non-HTML elements
        if (!HTML_ELEMENTS.has(node.parent.name.name)) {
          return;
        }

        checkAttribute(context, node);
      },

      CallExpression(node) {
        if (!isValidCreateElement(node)) {
          return;
        }

        const elemNameArg = node.arguments[0];

        if (!elemNameArg || elemNameArg.type !== 'Literal') {
          return; // can only check literals
        }

        // ignore non-HTML elements
        if (!HTML_ELEMENTS.has(elemNameArg.value)) {
          return;
        }

        const attributes = new Set(context.options[0] || DEFAULT_ATTRIBUTES);

        for (const attribute of attributes) {
          checkCreateProps(context, node, attribute);
        }
      },
    };
  },
};
