/**
 * @fileoverview Lifecycle methods should be methods on the prototype, not class fields
 * @author Tan Nguyen
 */

'use strict';

const values = require('object.values');

const Components = require('../util/Components');
const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');
const lifecycleMethods = require('../util/lifecycleMethods');

module.exports = {
  meta: {
    docs: {
      description: 'Lifecycle methods should be methods on the prototype, not class fields',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-arrow-function-lifecycle'),
    },
    schema: [],
    fixable: 'code',
  },

  create: Components.detect((context, components, utils) => {
    function getText(node) {
      const params = node.value.params.map((p) => p.name);

      if (node.type === 'Property') {
        return `: function(${params.join(', ')}) `;
      }

      if (node.type === 'ClassProperty' || node.type === 'PropertyDefinition') {
        return `(${params.join(', ')}) `;
      }

      return null;
    }

    /**
     * @param {Array} properties list of component properties
     */
    function reportNoArrowFunctionLifecycle(properties) {
      properties.forEach((node) => {
        if (!node || !node.value) {
          return;
        }

        const propertyName = astUtil.getPropertyName(node);
        const nodeType = node.value.type;
        const isLifecycleMethod = (
          node.static && !utils.isES5Component(node)
            ? lifecycleMethods.static
            : lifecycleMethods.instance
        ).indexOf(propertyName) > -1;

        if (nodeType === 'ArrowFunctionExpression' && isLifecycleMethod) {
          const range = [node.key.range[1], node.value.body.range[0]];
          const text = getText(node);

          context.report({
            node,
            message: '{{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.',
            data: {
              propertyName,
            },
            fix: (fixer) => fixer.replaceTextRange(range, text),
          });
        }
      });
    }

    return {
      'Program:exit'() {
        values(components.list()).forEach((component) => {
          const properties = astUtil.getComponentProperties(component.node);
          reportNoArrowFunctionLifecycle(properties);
        });
      },
    };
  }),
};
