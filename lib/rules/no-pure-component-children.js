/**
 * @fileoverview Prevent using React.PureComponent with children
 */
'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const has = require('has');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = {
  meta: {
    docs: {
      description: 'Prevent using React.PureComponent with children',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-pure-component-children')
    },
    schema: []
  },
  create: Components.detect((context, components, utils) => ({
    ClassDeclaration: function(node) {
      if (utils.isPureComponent(node)) {
        components.set(node, {
          isPureComponent: true
        });
      }
    },
    'Program:exit': function() {
      const list = components.list();

      for (const key in list) {
        if (!has(list, key)) {
          continue;
        }

        const component = list[key];
        if (!component.declaredPropTypes || !component.isPureComponent) {
          continue;
        }

        if (component.declaredPropTypes.children) {
          context.report(
            component.declaredPropTypes.children.node,
            'Do not use children with PureComponent',
            {name: 'children'}
          );
        }
      }
    }
  }))
};
