/**
 * @fileoverview Prevent common casing typos
 */

'use strict';

const PROP_TYPES = require('prop-types');
const fromEntries = require('object.fromentries');
const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const STATIC_CLASS_PROPERTIES = ['propTypes', 'contextTypes', 'childContextTypes', 'defaultProps'];
const STATIC_CLASS_PROPERTIES_LOWER_CASE = fromEntries(STATIC_CLASS_PROPERTIES.map((name) => ([
  name.toLowerCase(),
  name
])));
const STATIC_CLASS_PROPERTIES_LOCALE_LOWER_CASE = fromEntries(
  STATIC_CLASS_PROPERTIES.map((name) => [name.toLocaleLowerCase(), name])
);
const STATIC_LIFECYCLE_METHODS = ['getDerivedStateFromProps'];
const INVALID_STATIC_LIFECYCLE_METHODS = fromEntries(STATIC_LIFECYCLE_METHODS
  .map((name) => [name.toLowerCase(), name])
);
const LIFECYCLE_METHODS = [
  'getDerivedStateFromProps',
  'componentWillMount',
  'UNSAFE_componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'UNSAFE_componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'UNSAFE_componentWillUpdate',
  'getSnapshotBeforeUpdate',
  'componentDidUpdate',
  'componentDidCatch',
  'componentWillUnmount',
  'render'
];
const INVALID_LIFECYCLE_METHODS = fromEntries(LIFECYCLE_METHODS
  .map((name) => [name.toLowerCase(), name])
);

module.exports = {
  meta: {
    docs: {
      description: 'Prevent common typos',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('no-typos')
    },

    messages: {
      typoPropTypeChain: 'Typo in prop type chain qualifier: {{name}}',
      typoPropType: 'Typo in declared prop type: {{name}}',
      typoStaticClassProp: 'Typo in static class property declaration',
      typoPropDeclaration: 'Typo in property declaration',
      typoLifecycleMethod: 'Typo in component lifecycle method declaration: {{actual}} should be {{expected}}',
      staticLifecycleMethod: 'Lifecycle method should be static: {{method}}',
      noPropTypesBinding: '`\'prop-types\'` imported without a local `PropTypes` binding.',
      noReactBinding: '`\'react\'` imported without a local `React` binding.'
    },

    schema: []
  },

  create: Components.detect((context, components, utils) => {
    let propTypesPackageName = null;
    let reactPackageName = null;

    function checkValidPropTypeQualifier(node) {
      if (node.name !== 'isRequired') {
        context.report({
          node,
          messageId: 'typoPropTypeChain',
          data: {name: node.name}
        });
      }
    }

    function checkValidPropType(node) {
      if (node.name && !(node.name in PROP_TYPES)) {
        context.report({
          node,
          messageId: 'typoPropType',
          data: {name: node.name}
        });
      }
    }

    function isPropTypesPackage(node) {
      return (
        node.type === 'Identifier'
        && node.name === propTypesPackageName
      ) || (
        node.type === 'MemberExpression'
        && node.property.name === 'PropTypes'
        && node.object.name === reactPackageName
      );
    }

    /* eslint-disable no-use-before-define */

    function checkValidCallExpression(node) {
      const callee = node.callee;
      if (callee.type === 'MemberExpression' && callee.property.name === 'shape') {
        checkValidPropObject(node.arguments[0]);
      } else if (callee.type === 'MemberExpression' && callee.property.name === 'oneOfType') {
        const args = node.arguments[0];
        if (args && args.type === 'ArrayExpression') {
          args.elements.forEach((el) => {
            checkValidProp(el);
          });
        }
      }
    }

    function checkValidProp(node) {
      if ((!propTypesPackageName && !reactPackageName) || !node) {
        return;
      }

      if (node.type === 'MemberExpression') {
        if (
          node.object.type === 'MemberExpression'
          && isPropTypesPackage(node.object.object)
        ) { // PropTypes.myProp.isRequired
          checkValidPropType(node.object.property);
          checkValidPropTypeQualifier(node.property);
        } else if (
          isPropTypesPackage(node.object)
          && node.property.name !== 'isRequired'
        ) { // PropTypes.myProp
          checkValidPropType(node.property);
        } else if (node.object.type === 'CallExpression') {
          checkValidPropTypeQualifier(node.property);
          checkValidCallExpression(node.object);
        }
      } else if (node.type === 'CallExpression') {
        checkValidCallExpression(node);
      }
    }

    /* eslint-enable no-use-before-define */

    function checkValidPropObject(node) {
      if (node && node.type === 'ObjectExpression') {
        node.properties.forEach((prop) => checkValidProp(prop.value));
      }
    }

    function reportErrorIfPropertyCasingTypo(propertyValue, propertyKey, isClassProperty) {
      const propertyName = propertyKey.name;
      if (propertyName === 'propTypes' || propertyName === 'contextTypes' || propertyName === 'childContextTypes') {
        checkValidPropObject(propertyValue);
      }
      if (propertyName) {
        const propertyNameLowerCase = propertyName.toLowerCase();
        if (propertyNameLowerCase in STATIC_CLASS_PROPERTIES_LOWER_CASE
          && STATIC_CLASS_PROPERTIES_LOWER_CASE[propertyNameLowerCase] !== propertyName) {
          context.report({
            node: propertyKey,
            messageId: isClassProperty
              ? 'typoStaticClassProp'
              : 'typoPropDeclaration'
          });
        }
      }
    }

    function reportErrorIfLifecycleMethodCasingTypo(node) {
      let nodeKeyName = node.key.name;
      if (node.key.type === 'Literal') {
        nodeKeyName = node.key.value;
      }
      if (node.computed && typeof nodeKeyName !== 'string') {
        return;
      }

      const nodeKeyNameLowerCase = nodeKeyName.toLowerCase();

      if (!node.static) {
        if (nodeKeyNameLowerCase in INVALID_STATIC_LIFECYCLE_METHODS) {
          context.report({
            node,
            messageId: 'staticLifecycleMethod',
            data: {
              method: nodeKeyName
            }
          });
        }
      }

      if (nodeKeyNameLowerCase in INVALID_LIFECYCLE_METHODS
        && INVALID_LIFECYCLE_METHODS[nodeKeyNameLowerCase] !== nodeKeyName) {
        context.report({
          node,
          messageId: 'typoLifecycleMethod',
          data: {actual: nodeKeyName, expected: INVALID_LIFECYCLE_METHODS[nodeKeyNameLowerCase]}
        });
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source && node.source.value === 'prop-types') { // import PropType from "prop-types"
          if (node.specifiers.length > 0) {
            propTypesPackageName = node.specifiers[0].local.name;
          } else {
            context.report({
              node,
              messageId: 'noPropTypesBinding'
            });
          }
        } else if (node.source && node.source.value === 'react') { // import { PropTypes } from "react"
          if (node.specifiers.length > 0) {
            reactPackageName = node.specifiers[0].local.name; // guard against accidental anonymous `import "react"`
          } else {
            context.report({
              node,
              messageId: 'noReactBinding'
            });
          }
          if (node.specifiers.length >= 1) {
            const propTypesSpecifier = node.specifiers.find((specifier) => (
              specifier.imported && specifier.imported.name === 'PropTypes'
            ));
            if (propTypesSpecifier) {
              propTypesPackageName = propTypesSpecifier.local.name;
            }
          }
        }
      },

      ClassProperty(node) {
        if (!node.static || !utils.isES6Component(node.parent.parent)) {
          return;
        }

        reportErrorIfPropertyCasingTypo(node.value, node.key, true);
      },

      MemberExpression(node) {
        const propertyName = node.property.name;

        if (
          !propertyName
          || !(propertyName.toLowerCase() in STATIC_CLASS_PROPERTIES_LOCALE_LOWER_CASE)
        ) {
          return;
        }

        if (node.parent && node.parent.type === 'AssignmentExpression' && node.parent.right) {
          const relatedComponent = utils.getRelatedComponent(node);

          if (
            relatedComponent
            && (utils.isES6Component(relatedComponent.node) || utils.isReturningJSX(relatedComponent.node))
            && (node.parent && node.parent.type === 'AssignmentExpression' && node.parent.right)
          ) {
            reportErrorIfPropertyCasingTypo(node.parent.right, node.property, true);
          }
        }
      },

      MethodDefinition(node) {
        if (!utils.isES6Component(node.parent.parent)) {
          return;
        }

        reportErrorIfLifecycleMethodCasingTypo(node);
      },

      ObjectExpression(node) {
        const component = utils.isES5Component(node) && components.get(node);

        if (!component) {
          return;
        }

        node.properties.forEach((property) => {
          if (property.type !== 'SpreadElement') {
            reportErrorIfPropertyCasingTypo(property.value, property.key, false);
            reportErrorIfLifecycleMethodCasingTypo(property);
          }
        });
      }
    };
  })
};
