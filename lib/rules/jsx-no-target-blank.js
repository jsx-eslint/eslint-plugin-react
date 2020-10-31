/**
 * @fileoverview Forbid target='_blank' attribute
 * @author Kevin Miller
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const linkComponentsUtil = require('../util/linkComponents');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function lastIndexMatching(arr, condition) {
  return arr.map(condition).lastIndexOf(true);
}

function attributeValuePossiblyBlank(attribute) {
  if (!attribute.value) {
    return false;
  }
  const value = attribute.value;
  if (value.type === 'Literal' && typeof value.value === 'string' && value.value.toLowerCase() === '_blank') {
    return true;
  }
  if (value.type === 'JSXExpressionContainer') {
    const expr = value.expression;
    if (expr.type === 'Literal' && typeof expr.value === 'string' && expr.value.toLowerCase() === '_blank') {
      return true;
    }
    if (expr.type === 'ConditionalExpression') {
      if (expr.alternate.type === 'Literal' && expr.alternate.value && expr.alternate.value.toLowerCase() === '_blank') {
        return true;
      }
      if (expr.consequent.type === 'Literal' && expr.consequent.value && expr.consequent.value.toLowerCase() === '_blank') {
        return true;
      }
    }
  }
  return false;
}

function hasTargetBlank(node, warnOnSpreadAttributes, spreadAttributeIndex) {
  const targetIndex = lastIndexMatching(node.attributes, (attr) => attr.name && attr.name.name === 'target');
  const foundTargetBlank = targetIndex !== -1 && attributeValuePossiblyBlank(node.attributes[targetIndex]);
  return foundTargetBlank || (warnOnSpreadAttributes && targetIndex < spreadAttributeIndex);
}

function hasExternalLink(node, linkAttribute, warnOnSpreadAttributes, spreadAttributeIndex) {
  const linkIndex = lastIndexMatching(node.attributes, (attr) => attr.name && attr.name.name === linkAttribute);
  const foundExternalLink = linkIndex !== -1 && ((attr) => attr.value.type === 'Literal' && /^(?:\w+:|\/\/)/.test(attr.value.value))(
    node.attributes[linkIndex]);
  return foundExternalLink || (warnOnSpreadAttributes && linkIndex < spreadAttributeIndex);
}

function hasDynamicLink(node, linkAttribute) {
  const dynamicLinkIndex = lastIndexMatching(node.attributes, (attr) => attr.name
    && attr.name.name === linkAttribute
    && attr.value
    && attr.value.type === 'JSXExpressionContainer');
  if (dynamicLinkIndex !== -1) {
    return true;
  }
}

function hasSecureRel(node, allowReferrer, warnOnSpreadAttributes, spreadAttributeIndex) {
  const relIndex = lastIndexMatching(node.attributes, (attr) => (attr.type === 'JSXAttribute' && attr.name.name === 'rel'));

  if (relIndex === -1 || (warnOnSpreadAttributes && relIndex < spreadAttributeIndex)) {
    return false;
  }

  const relAttribute = node.attributes[relIndex];
  const value = relAttribute.value
    && ((
      relAttribute.value.type === 'Literal'
      && relAttribute.value.value
    ) || (
      relAttribute.value.type === 'JSXExpressionContainer'
      && relAttribute.value.expression
      && relAttribute.value.expression.value
    ));
  const tags = value && typeof value === 'string' && value.toLowerCase().split(' ');
  return tags && (allowReferrer ? tags.indexOf('noopener') >= 0 : tags.indexOf('noreferrer') >= 0);
}

module.exports = {
  meta: {
    docs: {
      description: 'Forbid `target="_blank"` attribute without `rel="noreferrer"`',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('jsx-no-target-blank')
    },
    schema: [{
      type: 'object',
      properties: {
        allowReferrer: {
          type: 'boolean'
        },
        enforceDynamicLinks: {
          enum: ['always', 'never']
        },
        warnOnSpreadAttributes: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create(context) {
    const configuration = context.options[0] || {};
    const allowReferrer = configuration.allowReferrer || false;
    const warnOnSpreadAttributes = configuration.warnOnSpreadAttributes || false;
    const enforceDynamicLinks = configuration.enforceDynamicLinks || 'always';
    const components = linkComponentsUtil.getLinkComponents(context);

    return {
      JSXOpeningElement(node) {
        if (!components.has(node.name.name)) {
          return;
        }

        const spreadAttributeIndex = lastIndexMatching(node.attributes, (attr) => (attr.type === 'JSXSpreadAttribute'));
        if (!hasTargetBlank(node, warnOnSpreadAttributes, spreadAttributeIndex)) {
          return;
        }

        const linkAttribute = components.get(node.name.name);
        const hasDangerousLink = hasExternalLink(node, linkAttribute, warnOnSpreadAttributes, spreadAttributeIndex)
          || (enforceDynamicLinks === 'always' && hasDynamicLink(node, linkAttribute));
        if (hasDangerousLink && !hasSecureRel(node, allowReferrer, warnOnSpreadAttributes, spreadAttributeIndex)) {
          context.report({
            node,
            message: 'Using target="_blank" without rel="noreferrer" '
              + 'is a security risk: see https://html.spec.whatwg.org/multipage/links.html#link-type-noopener'
          });
        }
      }
    };
  }
};
