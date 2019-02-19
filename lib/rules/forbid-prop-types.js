/**
 * @fileoverview Forbid certain propTypes
 */
'use strict';

const variableUtil = require('../util/variable');
const propsUtil = require('../util/props');
const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');
const propWrapperUtil = require('../util/propWrapper');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const PROP_TYPES_MODULE = 'prop-types';
const DEFAULTS = ['any', 'array', 'object'];

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Forbid certain propTypes',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('forbid-prop-types')
    },

    schema: [{
      type: 'object',
      properties: {
        forbid: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        forbidEmpty: {
          type: 'boolean'
        },
        checkContextTypes: {
          type: 'boolean'
        },
        checkChildContextTypes: {
          type: 'boolean'
        }
      },
      additionalProperties: true
    }]
  },

  create: function(context) {
    const configuration = context.options[0] || {};
    const checkContextTypes = configuration.checkContextTypes || false;
    const checkChildContextTypes = configuration.checkChildContextTypes || false;
    const forbidEmpty = configuration.forbidEmpty || false;
    const customPropTypeImports = [];

    function isEmptyArgument(arg) {
      const isEmptyArray = arg.type === 'ArrayExpression' && arg.elements.length === 0;
      const isEmptyObject = arg.type === 'ObjectExpression' && arg.properties.length === 0;

      return isEmptyArray || isEmptyObject;
    }

    function isMissingArguments(type, value) {
      const propIsAFunction = propsUtil.isPropTypeAFunction(type);

      // disregard custom prop-type imports (i.e. not the react prop-types)
      if (customPropTypeImports.length > 0) {
        const defaultImportSource = value && value.object && value.object.name;

        const isPropTypeFromDefaultImport = customPropTypeImports
          .findIndex(customImport => customImport === defaultImportSource) > -1;

        const isPropTypeFromNamedImport = customPropTypeImports
          .findIndex(customImport => customImport === type) > -1;

        if (isPropTypeFromDefaultImport || isPropTypeFromNamedImport) {
          return false;
        }
      }

      if (!propIsAFunction) {
        return false;
      }

      const hasArguments = value.parent && Array.isArray(value.parent.arguments) && value.parent.arguments.length > 0;
      const noPropertiesInArguments = hasArguments && value.parent.arguments.every(isEmptyArgument);

      return !hasArguments || noPropertiesInArguments;
    }

    function isForbidden(type) {
      const forbid = configuration.forbid || DEFAULTS;
      return forbid.indexOf(type) >= 0;
    }

    function shouldCheckContextTypes(node) {
      if (checkContextTypes && propsUtil.isContextTypesDeclaration(node)) {
        return true;
      }
      return false;
    }

    function shouldCheckChildContextTypes(node) {
      if (checkChildContextTypes && propsUtil.isChildContextTypesDeclaration(node)) {
        return true;
      }
      return false;
    }

    /**
     * Checks if propTypes declarations are forbidden
     * @param {Array} declarations The array of AST nodes being checked.
     * @returns {void}
     */
    function checkProperties(declarations) {
      declarations.forEach(declaration => {
        if (declaration.type !== 'Property') {
          return;
        }
        let target;
        let value = declaration.value;
        if (
          value.type === 'MemberExpression' &&
          value.property &&
          value.property.name &&
          value.property.name === 'isRequired'
        ) {
          value = value.object;
        }
        if (
          value.type === 'CallExpression' &&
          value.callee.type === 'MemberExpression'
        ) {
          value = value.callee;
        }
        if (value.property) {
          target = value.property.name;
        } else if (value.type === 'Identifier') {
          target = value.name;
        }
        if (isForbidden(target)) {
          context.report({
            node: declaration,
            message: `Prop type \`${target}\` is forbidden`
          });
        }
        if (forbidEmpty && isMissingArguments(target, value)) {
          context.report({
            node: declaration,
            message: `Prop type \`${target}\` is missing arguments`
          });
        }
      });
    }

    function checkNode(node) {
      switch (node && node.type) {
        case 'ObjectExpression':
          checkProperties(node.properties);
          break;
        case 'Identifier':
          const propTypesObject = variableUtil.findVariableByName(context, node.name);
          if (propTypesObject && propTypesObject.properties) {
            checkProperties(propTypesObject.properties);
          }
          break;
        case 'CallExpression':
          const innerNode = node.arguments && node.arguments[0];
          if (propWrapperUtil.isPropWrapperFunction(context, context.getSource(node.callee)) && innerNode) {
            checkNode(innerNode);
          }
          break;
        default:
          break;
      }
    }

    return {
      ClassProperty: function(node) {
        if (
          !propsUtil.isPropTypesDeclaration(node) &&
          !shouldCheckContextTypes(node) &&
          !shouldCheckChildContextTypes(node)
        ) {
          return;
        }
        checkNode(node.value);
      },

      MemberExpression: function(node) {
        if (
          !propsUtil.isPropTypesDeclaration(node) &&
          !shouldCheckContextTypes(node) &&
          !shouldCheckChildContextTypes(node)
        ) {
          return;
        }

        checkNode(node.parent.right);
      },

      MethodDefinition: function(node) {
        if (
          !propsUtil.isPropTypesDeclaration(node) &&
          !shouldCheckContextTypes(node) &&
          !shouldCheckChildContextTypes(node)
        ) {
          return;
        }

        const returnStatement = astUtil.findReturnStatement(node);

        if (returnStatement && returnStatement.argument) {
          checkNode(returnStatement.argument);
        }
      },

      ObjectExpression: function(node) {
        node.properties.forEach(property => {
          if (!property.key) {
            return;
          }

          if (
            !propsUtil.isPropTypesDeclaration(property) &&
            !shouldCheckContextTypes(property) &&
            !shouldCheckChildContextTypes(property)
          ) {
            return;
          }
          if (property.value.type === 'ObjectExpression') {
            checkProperties(property.value.properties);
          }
        });
      },

      VariableDeclaration: function(node) {
        node.declarations.forEach(declaration => {
          const isRequire = astUtil.getDeclarationType(declaration.init) === 'require';
          const requiredFromReactPropTypes =
            Array.isArray(declaration.init.arguments)
            && declaration.init.arguments.length
            && declaration.init.arguments[0].value === PROP_TYPES_MODULE;

          if (isRequire && !requiredFromReactPropTypes) {
            customPropTypeImports.push(declaration.id.name);
          }
        });
      },

      ImportDeclaration: function(node) {
        const importedFromReactPropTypes = node && node.source && node.source.value === PROP_TYPES_MODULE;

        if (importedFromReactPropTypes) {
          return;
        }

        // e.g. import { shape } from 'my-custom-prop-types'
        node.specifiers
          .filter(specifier => specifier.type === 'ImportSpecifier')
          .forEach(specifier => {
            customPropTypeImports.push(specifier.imported.name);
          });

        // e.g. import PropTypes from 'my-custom-prop-types'
        node.specifiers
          .filter(specifier => specifier.type === 'ImportDefaultSpecifier')
          .forEach(specifier => {
            customPropTypeImports.push(specifier.local.name);
          });
      }

    };
  }
};
