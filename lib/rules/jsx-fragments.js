/**
 * @fileoverview Enforce shorthand or standard form for React fragments.
 * @author Alex Zherdev
 */
'use strict';

const elementType = require('jsx-ast-utils/elementType');
const pragmaUtil = require('../util/pragma');
const variableUtil = require('../util/variable');
const versionUtil = require('../util/version');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function replaceNode(source, node, text) {
  return `${source.slice(0, node.range[0])}${text}${source.slice(node.range[1])}`;
}

module.exports = {
  meta: {
    docs: {
      description: 'Enforce shorthand or standard form for React fragments',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-fragments')
    },
    fixable: 'code',

    schema: [{
      enum: ['syntax', 'element']
    }]
  },

  create: function(context) {
    const configuration = context.options[0] || 'syntax';
    const sourceCode = context.getSourceCode();
    const jsxFragPragma = pragmaUtil.getJsxFragFromContext(context);
    const jsxFragPragmaObject = jsxFragPragma.split('.')[0];
    const jsxFragPragmaProperty = jsxFragPragma.split('.')[1];
    const openFragShort = '<>';
    const closeFragShort = '</>';
    const openFragLong = `<${jsxFragPragma}>`;
    const closeFragLong = `</${jsxFragPragma}>`;

    /**
     * @todo Remove following error when
     * `refersToReactFragment` supports things like
     * `thisis.double.propertyFragment` or
     * `fragmentWithoutPropertyAccess`.
     */
    if (jsxFragPragma.split('.').length !== 2) {
      throw new Error(`jsx-fragments rule does not support jsxFragPragma without single property access and with more than one access. Use member expression with single property access like React.Fragment instead of ${jsxFragPragma}`);
    }

    function reportOnReactVersion(node) {
      if (!versionUtil.testReactVersion(context, '16.2.0')) {
        context.report({
          node,
          message: 'Fragments are only supported starting from React v16.2. '
            + 'Please disable the `react/jsx-fragments` rule in ESLint settings or upgrade your version of React.'
        });
        return true;
      }

      return false;
    }

    function getFixerToLong(jsxFragment) {
      return function(fixer) {
        let source = sourceCode.getText();
        source = replaceNode(source, jsxFragment.closingFragment, closeFragLong);
        source = replaceNode(source, jsxFragment.openingFragment, openFragLong);
        const lengthDiff = openFragLong.length - sourceCode.getText(jsxFragment.openingFragment).length
          + closeFragLong.length - sourceCode.getText(jsxFragment.closingFragment).length;
        const range = jsxFragment.range;
        return fixer.replaceTextRange(range, source.slice(range[0], range[1] + lengthDiff));
      };
    }

    function getFixerToShort(jsxElement) {
      return function(fixer) {
        let source = sourceCode.getText();
        let lengthDiff;
        if (jsxElement.closingElement) {
          source = replaceNode(source, jsxElement.closingElement, closeFragShort);
          source = replaceNode(source, jsxElement.openingElement, openFragShort);
          lengthDiff = sourceCode.getText(jsxElement.openingElement).length - openFragShort.length
            + sourceCode.getText(jsxElement.closingElement).length - closeFragShort.length;
        } else {
          source = replaceNode(source, jsxElement.openingElement, `${openFragShort}${closeFragShort}`);
          lengthDiff = sourceCode.getText(jsxElement.openingElement).length - openFragShort.length
            - closeFragShort.length;
        }

        const range = jsxElement.range;
        return fixer.replaceTextRange(range, source.slice(range[0], range[1] - lengthDiff));
      };
    }

    function refersToReactFragment(name) {
      const variableInit = variableUtil.findVariableByName(context, name);
      if (!variableInit) {
        return false;
      }

      // const { Fragment } = React;
      if (variableInit.type === 'Identifier' && variableInit.name === jsxFragPragmaObject) {
        return true;
      }

      // const Fragment = React.Fragment;
      if (
        variableInit.type === 'MemberExpression'
        && variableInit.object.type === 'Identifier'
        && variableInit.object.name === jsxFragPragmaObject
        && variableInit.property.type === 'Identifier'
        && variableInit.property.name === jsxFragPragmaProperty
      ) {
        return true;
      }

      // const { Fragment } = require('react');
      if (
        variableInit.callee
        && variableInit.callee.name === 'require'
        && variableInit.arguments
        && variableInit.arguments[0]
        && variableInit.arguments[0].value === 'react'
      ) {
        return true;
      }

      return false;
    }

    const jsxElements = [];
    const fragmentNames = new Set([`${jsxFragPragma}`]);

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXElement(node) {
        jsxElements.push(node);
      },

      JSXFragment(node) {
        if (reportOnReactVersion(node)) {
          return;
        }

        if (configuration === 'element') {
          context.report({
            node,
            message: `Prefer ${jsxFragPragma} over fragment shorthand`,
            fix: getFixerToLong(node)
          });
        }
      },

      ImportDeclaration(node) {
        if (node.source && node.source.value === 'react') {
          node.specifiers.forEach(spec => {
            if (spec.imported && spec.imported.name === jsxFragPragmaProperty) {
              if (spec.local) {
                fragmentNames.add(spec.local.name);
              }
            }
          });
        }
      },

      'Program:exit'() {
        jsxElements.forEach(node => {
          const openingEl = node.openingElement;
          const elName = elementType(openingEl);

          if (fragmentNames.has(elName) || refersToReactFragment(elName)) {
            if (reportOnReactVersion(node)) {
              return;
            }

            const attrs = openingEl.attributes;
            if (configuration === 'syntax' && !(attrs && attrs.length > 0)) {
              context.report({
                node,
                message: `Prefer fragment shorthand over ${jsxFragPragma}`,
                fix: getFixerToShort(node)
              });
            }
          }
        });
      }
    };
  }
};
