/**
 * @fileoverview Prevent using constructor in React components
 * @author Alex Husakov <@zoomchik>
 */
'use strict';

const Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent using constructor in React components, insted use static propTypes properties',
      category: 'Best Practices'
    }
  },

  create: Components.detect((context, components) => {
    function reportConstructorInComponent(node) {
      context.report({
        node: node,
        message: 'Do not use constructor in React components'
      });
    }

    return {
      'Program:exit': function() {
        const list = components.list();
        let constructors = [];

        Object.keys(list).forEach(key => {
          const methods = list[key].node.body.body.filter(node =>
            node.type === 'MethodDefinition' &&
            node.kind === 'constructor');

          constructors = constructors.concat(methods);
        });

        constructors.forEach(node => {
          reportConstructorInComponent(node);
        });
      }
    };
  })
};
