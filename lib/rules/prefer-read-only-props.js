/**
 * @fileoverview Require component props to be typed as read-only.
 * @author Luke Zapart
 */

'use strict';

const entries = require('object.entries');
const values = require('object.values');
const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');

function isFlowPropertyType(node) {
  return node.type === 'ObjectTypeProperty';
}

function isCovariant(node) {
  return (node.variance && (node.variance.kind === 'plus')) || (node.parent.parent.parent.id && (node.parent.parent.parent.id.name === '$ReadOnly'));
}

const reportPropTypeWithContext = (context) => (propEntry) => {
  const propName = propEntry[0];
  const prop = propEntry[1];
  if (!isFlowPropertyType(prop.node)) {
    return;
  }

  if (!isCovariant(prop.node)) {
    context.report({
      node: prop.node,
      messageId: 'readOnlyProp',
      data: {
        name: propName
      },
      fix: (fixer) => {
        if (!prop.node.variance) {
          // Insert covariance
          return fixer.insertTextBefore(prop.node, '+');
        }

        // Replace contravariance with covariance
        return fixer.replaceText(prop.node.variance, '+');
      }
    });
  }
};

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Require read-only props.',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('prefer-read-only-props')
    },
    fixable: 'code',

    messages: {
      readOnlyProp: 'Prop \'{{name}}\' should be read-only.'
    },

    schema: []
  },

  create: Components.detect((context, components) => ({
    'Program:exit'() {
      const list = components.list();

      const reportPropType = reportPropTypeWithContext(context);

      values(list).forEach((component) => {
        if (!component.declaredPropTypes) {
          return;
        }

        entries(component.declaredPropTypes).forEach(reportPropType);
      });
    }
  }))
};
