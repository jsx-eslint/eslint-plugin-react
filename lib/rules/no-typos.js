/**
 * @fileoverview Prevent common casing typos
 */
'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const STATIC_CLASS_PROPERTIES = ['propTypes', 'contextTypes', 'childContextTypes', 'defaultProps'];
const LIFECYCLE_METHODS = [
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
  'render'
];

const PROP_TYPES = Object.keys(require('prop-types'));

module.exports = {
  meta: {
    docs: {
      description: 'Prevent common typos',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('no-typos')
    },
    schema: []
  },

  create: Components.detect((context, components, utils) => {
    let propTypesPackageName = null;
    let reactPackageName = null;

    function checkValidPropTypeQualfier(node) {
      if (node.name !== 'isRequired') {
        context.report({
          node: node,
          message: `Typo in prop type chain qualifier: ${node.name}`
        });
      }
    }

    function checkValidPropType(node) {
      if (node.name && !PROP_TYPES.some(propTypeName => propTypeName === node.name)) {
        context.report({
          node: node,
          message: `Typo in declared prop type: ${node.name}`
        });
      }
    }

    function isPropTypesPackage(node) {
      return (
        node.type === 'Identifier' &&
        node.name == propTypesPackageName
      ) || (
        node.type === 'MemberExpression' &&
        node.property.name === 'PropTypes' &&
        node.object.name == reactPackageName
      );
    }

    function checkValidCallExpression(node) {
      const callee = node.callee;
      if (callee.type === 'MemberExpression' && callee.property.name === 'shape') {
        checkValidPropObject(node.arguments[0]);
      } else if (callee.type === 'MemberExpression' && callee.property.name === 'oneOfType') {
        const args = node.arguments[0];
        if (args && args.type === 'ArrayExpression') {
          args.elements.forEach(el => checkValidProp(el));
        }
      }
    }

    /* eslint-disable no-use-before-define */
    function checkValidProp(node) {
      if ((!propTypesPackageName && !reactPackageName) || !node) {
        return;
      }

      if (node.type === 'MemberExpression') {
        if (
          node.object.type === 'MemberExpression' &&
          isPropTypesPackage(node.object.object)
        ) { // PropTypes.myProp.isRequired
          checkValidPropType(node.object.property);
          checkValidPropTypeQualfier(node.property);
        } else if (
          isPropTypesPackage(node.object) &&
          node.property.name !== 'isRequired'
        ) { // PropTypes.myProp
          checkValidPropType(node.property);
        } else if (node.object.type === 'CallExpression') {
          checkValidPropTypeQualfier(node.property);
          checkValidCallExpression(node.object);
        }
      } else if (node.type === 'CallExpression') {
        checkValidCallExpression(node);
      }
    }

    function checkValidPropObject (node) {
      if (node && node.type === 'ObjectExpression') {
        node.properties.forEach(prop => checkValidProp(prop.value));
      }
    }

    function reportErrorIfClassPropertyCasingTypo(node, propertyName) {
      if (propertyName === 'propTypes' || propertyName === 'contextTypes' || propertyName === 'childContextTypes') {
        const propsNode = node && node.parent && node.parent.type === 'AssignmentExpression' && node.parent.right;
        checkValidPropObject(propsNode);
      }
      STATIC_CLASS_PROPERTIES.forEach(CLASS_PROP => {
        if (propertyName && CLASS_PROP.toLowerCase() === propertyName.toLowerCase() && CLASS_PROP !== propertyName) {
          context.report({
            node: node,
            message: 'Typo in static class property declaration'
          });
        }
      });
    }

    function reportErrorIfLifecycleMethodCasingTypo(node) {
      LIFECYCLE_METHODS.forEach(method => {
        if (method.toLowerCase() === node.key.name.toLowerCase() && method !== node.key.name) {
          context.report({
            node: node,
            message: 'Typo in component lifecycle method declaration'
          });
        }
      });
    }

    return {
      ImportDeclaration: function(node) {
        if (node.source && node.source.value === 'prop-types') { // import PropType from "prop-types"
          propTypesPackageName = node.specifiers[0].local.name;
        } else if (node.source && node.source.value === 'react') { // import { PropTypes } from "react"
          reactPackageName = node.specifiers[0].local.name;

          propTypesPackageName = node.specifiers.length >= 1 ? (
            node.specifiers
              .filter(specifier => specifier.imported && specifier.imported.name === 'PropTypes')
              .map(specifier => specifier.local.name)
          ) : null;
        }
      },

      ClassProperty: function(node) {
        if (!node.static || !utils.isES6Component(node.parent.parent)) {
          return;
        }

        const tokens = context.getFirstTokens(node, 2);
        const propertyName = tokens[1].value;
        reportErrorIfClassPropertyCasingTypo(node, propertyName);
      },

      MemberExpression: function(node) {
        const propertyName = node.property.name;

        if (
          !propertyName ||
          STATIC_CLASS_PROPERTIES.map(prop => prop.toLocaleLowerCase()).indexOf(propertyName.toLowerCase()) === -1
        ) {
          return;
        }

        const relatedComponent = utils.getRelatedComponent(node);

        if (
          relatedComponent &&
          (utils.isES6Component(relatedComponent.node) || utils.isReturningJSX(relatedComponent.node))
        ) {
          reportErrorIfClassPropertyCasingTypo(node, propertyName);
        }
      },

      MethodDefinition: function (node) {
        if (!utils.isES6Component(node.parent.parent)) {
          return;
        }

        reportErrorIfLifecycleMethodCasingTypo(node);
      }
    };
  })
};
