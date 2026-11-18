/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */

'use strict';

const values = require('object.values');

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  onlyOneComponent: 'Declare only one React component per file',
  onlyOneExportedComponent: 'Declare only one exported React component per file',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Disallow multiple component definition per file',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('no-multi-comp'),
    },

    messages,

    schema: [{
      type: 'object',
      properties: {
        ignoreStateless: {
          default: false,
          type: 'boolean',
        },
        ignoreInternal: {
          default: false,
          type: 'boolean',
        },
      },
      additionalProperties: false,
    }],
  },

  create: Components.detect((context, components, utils) => {
    const configuration = context.options[0] || {};
    const ignoreStateless = configuration.ignoreStateless || false;
    const ignoreInternal = configuration.ignoreInternal || false;

    const exportedComponents = new Set(); // Track exported components
    const validIdentifiers = new Set(['ArrowFunctionExpression', 'Identifier', 'FunctionExpression']);

    /**
     * Given an export declaration, find the export name.
     * @param {Object} node
     * @returns {string}
     */
    function getExportedComponentName(node) {
      if (node.declaration.type === 'ClassDeclaration') {
        return node.declaration.id.name;
      }
      if (node.declaration.type === 'Identifier') {
        return node.declaration.name;
      }
      if (node.declaration.declarations) {
        const declarator = node.declaration.declarations.find((declaration) => validIdentifiers.has(declaration.init.type));
        if (declarator) {
          return declarator.id.name;
        }
      }
    }

    /**
     * Given a React component, find the exported name.
     * @param {Object} component
     * @returns {string}
     */
    function findComponentIdentifierFromComponent(component) {
      let name;
      if (component.node.parent.id) {
        name = component.node.parent.id.name;
      }
      if (!name) {
        name = component.node.id.name;
      }
      return name;
    }

    /**
     * Checks if the component is ignored
     * @param {Object} component The component being checked.
     * @returns {boolean} True if the component is ignored, false if not.
     */
    function isIgnored(component) {
      return (
        ignoreStateless && (
          /Function/.test(component.node.type)
          || utils.isPragmaComponentWrapper(component.node)
        )
      );
    }

    /**
     * Checks if the component is exported, if exportOnly is set
     * @param {Object} component The component being checked.
     * @returns {boolean} True if the component is exported or exportOnly is false
     */
    function isPrivate(component) {
      return ignoreInternal && !exportedComponents.has(findComponentIdentifierFromComponent(component));
    }

    const rule = {
      'Program:exit'() {
        if (components.length() <= 1) {
          return;
        }

        values(components.list())
          .filter((component) => !isIgnored(component) && !isPrivate(component))
          .slice(1)
          .forEach((component) => {
            report(context,
              ignoreInternal ? messages.onlyOneExportedComponent : messages.onlyOneComponent,
              ignoreInternal ? 'onlyOneExportedComponent' : 'onlyOneComponent',
              {
                node: component.node,
              });
          });
      },
    };

    if (ignoreInternal) {
      Object.assign(rule, {
        ExportNamedDeclaration(node) {
          exportedComponents.add(getExportedComponentName(node));
        },
        ExportDefaultDeclaration(node) {
          exportedComponents.add(getExportedComponentName(node));
        },
      });
    }

    return rule;
  }),
};
