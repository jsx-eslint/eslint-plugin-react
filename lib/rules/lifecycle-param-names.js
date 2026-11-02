/**
 * @fileoverview Enforce the conventional parameter names of lifecycle methods
 */

'use strict';

const has = require('hasown');
const values = require('object.values');

const Components = require('../util/Components');
const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {Record<string, string[]>} */
const INSTANCE_PARAM_NAMES = {
  componentDidUpdate: ['prevProps', 'prevState', 'snapshot'],
  shouldComponentUpdate: ['nextProps', 'nextState'],
  componentWillReceiveProps: ['nextProps'],
  UNSAFE_componentWillReceiveProps: ['nextProps'],
  componentWillUpdate: ['nextProps', 'nextState'],
  UNSAFE_componentWillUpdate: ['nextProps', 'nextState'],
  getSnapshotBeforeUpdate: ['prevProps', 'prevState'],
  componentDidCatch: ['error', 'info'],
};

/** @type {Record<string, string[]>} */
const STATIC_PARAM_NAMES = {
  getDerivedStateFromProps: ['props', 'state'],
  getDerivedStateFromError: ['error'],
};

const messages = {
  wrongName: 'The parameter `{{name}}` of `{{method}}` should be named `{{expected}}`.',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Enforce the conventional parameter names of lifecycle methods',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('lifecycle-param-names'),
    },

    messages,

    schema: [],
  },

  create: Components.detect((context, components) => {
    /**
     * @param {ASTNode} node A component property
     * @returns {string[] | undefined} The expected parameter names, if the property is a lifecycle method
     */
    function getExpectedNames(node) {
      if (node.computed) {
        return undefined;
      }
      const name = astUtil.getPropertyName(node);
      if (node.type === 'MethodDefinition' && node.kind === 'constructor') {
        return ['props'];
      }
      const names = node.static ? STATIC_PARAM_NAMES : INSTANCE_PARAM_NAMES;
      return has(names, name) ? names[name] : undefined;
    }

    /**
     * @param {ASTNode} node A component property
     */
    function checkProperty(node) {
      const fn = node.value;
      if (
        !fn
        || (fn.type !== 'FunctionExpression' && fn.type !== 'ArrowFunctionExpression')
      ) {
        return;
      }
      const expectedNames = getExpectedNames(node);
      if (!expectedNames) {
        return;
      }

      // a TypeScript `this` parameter is not a real parameter
      const params = fn.params.length > 0 && fn.params[0].type === 'Identifier' && fn.params[0].name === 'this'
        ? fn.params.slice(1)
        : fn.params;

      params.slice(0, expectedNames.length).forEach((param, i) => {
        if (param.type === 'Identifier' && param.name !== expectedNames[i]) {
          report(context, messages.wrongName, 'wrongName', {
            node: param,
            data: {
              name: param.name,
              method: node.kind === 'constructor' ? 'constructor' : astUtil.getPropertyName(node),
              expected: expectedNames[i],
            },
          });
        }
      });
    }

    return {
      'Program:exit'() {
        values(components.list()).forEach((component) => {
          astUtil.getComponentProperties(component.node).forEach(checkProperty);
        });
      },
    };
  }),
};
