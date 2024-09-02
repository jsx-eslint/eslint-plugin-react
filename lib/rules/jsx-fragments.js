/**
 * @fileoverview Enforce shorthand or standard form for React fragments.
 * @author Alex Zherdev
 */

'use strict';

const elementType = require('jsx-ast-utils/elementType');
const pragmaUtil = require('../util/pragma');
const variableUtil = require('../util/variable');
const testReactVersion = require('../util/version').testReactVersion;
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');
const getText = require('../util/eslint').getText;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function replaceNode(source, node, text) {
  return `${source.slice(0, node.range[0])}${text}${source.slice(node.range[1])}`;
}

const messages = {
  fragmentsNotSupported: 'Fragments are only supported starting from React v16.2. '
    + 'Please disable the `react/jsx-fragments` rule in `eslint` settings or upgrade your version of React.',
  preferPragma: 'Prefer {{react}}.{{fragment}} over fragment shorthand',
  preferPragmaShort: 'Prefer {{fragment}} over fragment shorthand',
  preferFragment: 'Prefer fragment shorthand over {{react}}.{{fragment}}',
};

module.exports = {
  meta: {
    docs: {
      description: 'Enforce shorthand or standard form for React fragments',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-fragments'),
    },
    fixable: 'code',

    messages,

    schema: [{
      enum: ['syntax', 'element', 'elementShort'],
    }],
  },

  create(context) {
    const configuration = context.options[0] || 'syntax';
    const reactPragma = pragmaUtil.getFromContext(context);
    const fragmentPragma = pragmaUtil.getFragmentFromContext(context);
    const openFragShort = '<>';
    const closeFragShort = '</>';
    const openFragLong = `<${reactPragma}.${fragmentPragma}>`;
    const closeFragLong = `</${reactPragma}.${fragmentPragma}>`;
    const openFragMedium = `<${fragmentPragma}>`;
    const closeFragMedium = `</${fragmentPragma}>`;

    const reactImports = [];

    function reportOnReactVersion(node) {
      if (!testReactVersion(context, '>= 16.2.0')) {
        report(context, messages.fragmentsNotSupported, 'fragmentsNotSupported', {
          node,
        });
        return true;
      }

      return false;
    }

    function getFixerToLong(jsxFragment, withoutReactPragma) {
      if (!jsxFragment.closingFragment || !jsxFragment.openingFragment) {
        // the old TS parser crashes here
        // TODO: FIXME: can we fake these two descriptors?
        return null;
      }
      return function fix(fixer) {
        const closeFrag = withoutReactPragma ? closeFragMedium : closeFragLong;
        const openFrag = withoutReactPragma ? openFragMedium : openFragLong;
        let source = getText(context);
        source = replaceNode(source, jsxFragment.closingFragment, closeFrag);
        source = replaceNode(source, jsxFragment.openingFragment, openFrag);
        const lengthDiff = openFrag.length - getText(context, jsxFragment.openingFragment).length
          + closeFrag.length - getText(context, jsxFragment.closingFragment).length;
        const range = jsxFragment.range;

        const fixes = [];

        // Insert the import statement at the top of the file if `withoutReactPragma` is true
        if (withoutReactPragma) {
          const ancestors = context.getAncestors();
          const rootNode = ancestors.length > 0 ? ancestors[0] : jsxFragment;
          const reactImport = reactImports.find(importNode => importNode.specifiers.some((spec) => spec.imported && spec.imported.name === fragmentPragma));

          if (!reactImport) {
            // No `Fragment` import found, so add it
            const existingReactImport = reactImports.find(importNode => importNode.source.value === 'react');

            if (existingReactImport) {
              // If there's already an import from 'react', add `Fragment` to the existing specifiers
              const lastSpecifier = existingReactImport.specifiers[existingReactImport.specifiers.length - 1];
              fixes.push(fixer.insertTextAfter(lastSpecifier, `, ${fragmentPragma}`));
            } else {
              // Otherwise, add a new import statement at the top
              // eslint-disable-next-line semi
              fixes.push(fixer.insertTextBefore(rootNode.body[0], `import { Fragment } from 'react';\n\n`));
            }
          }
        }

        fixes.push(fixer.replaceTextRange(range, source.slice(range[0], range[1] + lengthDiff)));

        return fixes;
      };
    }

    function getFixerToShort(jsxElement) {
      return function fix(fixer) {
        let source = getText(context);
        let lengthDiff;
        if (jsxElement.closingElement) {
          source = replaceNode(source, jsxElement.closingElement, closeFragShort);
          source = replaceNode(source, jsxElement.openingElement, openFragShort);
          lengthDiff = getText(context, jsxElement.openingElement).length - openFragShort.length
            + getText(context, jsxElement.closingElement).length - closeFragShort.length;
        } else {
          source = replaceNode(source, jsxElement.openingElement, `${openFragShort}${closeFragShort}`);
          lengthDiff = getText(context, jsxElement.openingElement).length - openFragShort.length
            - closeFragShort.length;
        }

        const range = jsxElement.range;
        return fixer.replaceTextRange(range, source.slice(range[0], range[1] - lengthDiff));
      };
    }

    function refersToReactFragment(node, name) {
      const variableInit = variableUtil.findVariableByName(context, node, name);
      if (!variableInit) {
        return false;
      }

      // const { Fragment } = React;
      if (variableInit.type === 'Identifier' && variableInit.name === reactPragma) {
        return true;
      }

      // const Fragment = React.Fragment;
      if (
        variableInit.type === 'MemberExpression'
        && variableInit.object.type === 'Identifier'
        && variableInit.object.name === reactPragma
        && variableInit.property.type === 'Identifier'
        && variableInit.property.name === fragmentPragma
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
    const fragmentNames = new Set([`${reactPragma}.${fragmentPragma}`]);

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
          report(context, messages.preferPragma, 'preferPragma', {
            node,
            data: {
              react: reactPragma,
              fragment: fragmentPragma,
            },
            fix: getFixerToLong(node),
          });
        }

        if (configuration === 'elementShort') {
          report(context, messages.preferPragmaShort, 'preferPragmaShort', {
            node,
            data: {
              react: reactPragma,
              fragment: fragmentPragma,
            },
            fix: getFixerToLong(node, true),
          });
        }
      },

      ImportDeclaration(node) {
        if (node.source && node.source.value === 'react') {
          reactImports.push(node);

          node.specifiers.forEach((spec) => {
            if (spec.imported && spec.imported.name === fragmentPragma) {
              if (spec.local) {
                fragmentNames.add(spec.local.name);
              }
            }
          });
        }
      },

      'Program:exit'() {
        jsxElements.forEach((node) => {
          const openingEl = node.openingElement;
          const elName = elementType(openingEl);

          if (fragmentNames.has(elName) || refersToReactFragment(node, elName)) {
            if (reportOnReactVersion(node)) {
              return;
            }

            const attrs = openingEl.attributes;
            if (configuration === 'syntax' && !(attrs && attrs.length > 0)) {
              report(context, messages.preferFragment, 'preferFragment', {
                node,
                data: {
                  react: reactPragma,
                  fragment: fragmentPragma,
                },
                fix: getFixerToShort(node),
              });
            }
          }
        });
      },
    };
  },
};
