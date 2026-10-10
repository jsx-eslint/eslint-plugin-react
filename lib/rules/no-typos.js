/**
 * @fileoverview Prevent common casing typos
 */

'use strict';

const PROP_TYPES = Object.keys(require('prop-types'));
const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const astUtil = require('../util/ast');
const componentUtil = require('../util/componentUtil');
const report = require('../util/report');
const lifecycleMethods = require('../util/lifecycleMethods');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const STATIC_CLASS_PROPERTIES = ['propTypes', 'contextTypes', 'childContextTypes', 'defaultProps'];

/**
 * @param {string[]} values
 * @returns {Object.<string, string>}
 */
function createCaseInsensitiveMap(values) {
  const map = Object.create(null);
  values.forEach((value) => {
    map[value.toLowerCase()] = value;
  });
  return map;
}

const STATIC_CLASS_PROPERTIES_BY_LOWERCASE = createCaseInsensitiveMap(STATIC_CLASS_PROPERTIES);
const STATIC_LIFECYCLE_METHODS_BY_LOWERCASE = createCaseInsensitiveMap(lifecycleMethods.static);
const LIFECYCLE_METHODS_BY_LOWERCASE = createCaseInsensitiveMap(lifecycleMethods.instance.concat(lifecycleMethods.static));

const messages = {
  typoPropTypeChain: 'Typo in prop type chain qualifier: {{name}}',
  typoPropType: 'Typo in declared prop type: {{name}}',
  typoStaticClassProp: 'Typo in static class property declaration',
  typoPropDeclaration: 'Typo in property declaration',
  typoLifecycleMethod: 'Typo in component lifecycle method declaration: {{actual}} should be {{expected}}',
  staticLifecycleMethod: 'Lifecycle method should be static: {{method}}',
  noPropTypesBinding: '`\'prop-types\'` imported without a local `PropTypes` binding.',
  noReactBinding: '`\'react\'` imported without a local `React` binding.',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Disallow common typos',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('no-typos'),
    },

    messages,

    schema: [],
  },

  create: Components.detect((context, components, utils) => {
    let propTypesPackageName = null;
    let reactPackageName = null;

    function checkValidPropTypeQualifier(node) {
      if (node.name !== 'isRequired') {
        report(context, messages.typoPropTypeChain, 'typoPropTypeChain', {
          node,
          data: { name: node.name },
        });
      }
    }

    function checkValidPropType(node) {
      if (node.name && !PROP_TYPES.some((propTypeName) => propTypeName === node.name)) {
        report(context, messages.typoPropType, 'typoPropType', {
          node,
          data: { name: node.name },
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
        } else if (astUtil.isCallExpression(node.object)) {
          checkValidPropTypeQualifier(node.property);
          checkValidCallExpression(node.object);
        }
      } else if (astUtil.isCallExpression(node)) {
        checkValidCallExpression(node);
      }
    }

    /* eslint-enable no-use-before-define */

    function checkValidPropObject(node) {
      if (node && node.type === 'ObjectExpression') {
        node.properties.forEach((prop) => checkValidProp(prop.value));
      }
    }

    function reportErrorIfPropertyCasingTypo(propertyValue, property, isClassProperty) {
      const propertyName = astUtil.getPropertyName(property);
      if (propertyName === 'propTypes' || propertyName === 'contextTypes' || propertyName === 'childContextTypes') {
        checkValidPropObject(propertyValue);
      }
      const staticProperty = propertyName && STATIC_CLASS_PROPERTIES_BY_LOWERCASE[propertyName.toLowerCase()];
      if (staticProperty && staticProperty !== propertyName) {
        const messageId = isClassProperty
          ? 'typoStaticClassProp'
          : 'typoPropDeclaration';
        report(context, messages[messageId], messageId, {
          node: property.key || property.property,
        });
      }
    }

    function reportErrorIfLifecycleMethodCasingTypo(node) {
      const nodeKeyName = astUtil.getPropertyName(node);
      if (!nodeKeyName) {
        return;
      }

      const lowerCaseName = nodeKeyName.toLowerCase();
      if (!node.static && STATIC_LIFECYCLE_METHODS_BY_LOWERCASE[lowerCaseName]) {
        report(context, messages.staticLifecycleMethod, 'staticLifecycleMethod', {
          node,
          data: {
            method: nodeKeyName,
          },
        });
      }

      const lifecycleMethod = LIFECYCLE_METHODS_BY_LOWERCASE[lowerCaseName];
      if (lifecycleMethod && lifecycleMethod !== nodeKeyName) {
        report(context, messages.typoLifecycleMethod, 'typoLifecycleMethod', {
          node,
          data: { actual: nodeKeyName, expected: lifecycleMethod },
        });
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source && node.source.value === 'prop-types') { // import PropType from "prop-types"
          if (node.specifiers.length > 0) {
            propTypesPackageName = node.specifiers[0].local.name;
          } else {
            report(context, messages.noPropTypesBinding, 'noPropTypesBinding', {
              node,
            });
          }
        } else if (node.source && node.source.value === 'react') { // import { PropTypes } from "react"
          if (node.specifiers.length > 0) {
            reactPackageName = node.specifiers[0].local.name; // guard against accidental anonymous `import "react"`
          } else {
            report(context, messages.noReactBinding, 'noReactBinding', {
              node,
            });
          }
          if (node.specifiers.length >= 1) {
            const propTypesSpecifier = node.specifiers.find((specifier) => (
              specifier.imported
              && specifier.imported.name === 'PropTypes'
            ));
            if (propTypesSpecifier) {
              propTypesPackageName = propTypesSpecifier.local.name;
            }
          }
        }
      },

      'ClassProperty, PropertyDefinition'(node) {
        if (!node.static || !componentUtil.isES6Component(node.parent.parent, context)) {
          return;
        }

        reportErrorIfPropertyCasingTypo(node.value, node, true);
      },

      MemberExpression(node) {
        const propertyName = astUtil.getPropertyName(node);

        if (
          !propertyName
          || !STATIC_CLASS_PROPERTIES_BY_LOWERCASE[propertyName.toLowerCase()]
        ) {
          return;
        }

        const relatedComponent = utils.getRelatedComponent(node);

        if (
          relatedComponent
            && (componentUtil.isES6Component(relatedComponent.node, context) || (
              relatedComponent.node.type !== 'ClassDeclaration' && utils.isReturningJSX(relatedComponent.node)))
            && (node.parent && node.parent.type === 'AssignmentExpression' && node.parent.right)
        ) {
          reportErrorIfPropertyCasingTypo(node.parent.right, node, true);
        }
      },

      MethodDefinition(node) {
        if (!componentUtil.isES6Component(node.parent.parent, context)) {
          return;
        }

        reportErrorIfLifecycleMethodCasingTypo(node);
      },

      ObjectExpression(node) {
        const component = componentUtil.isES5Component(node, context) && components.get(node);

        if (!component) {
          return;
        }

        node.properties.filter((property) => property.type !== 'SpreadElement').forEach((property) => {
          reportErrorIfPropertyCasingTypo(property.value, property, false);
          reportErrorIfLifecycleMethodCasingTypo(property);
        });
      },
    };
  }),
};
