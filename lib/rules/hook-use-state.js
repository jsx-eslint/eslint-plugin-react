/**
 * @fileoverview Ensure symmetric naming of useState hook value and setter variables
 * @author Duncan Beevers
 */

'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');
const getMessageData = require('../util/message');
const eslintUtil = require('../util/eslint');

const getDeclaredVariables = eslintUtil.getDeclaredVariables;
const getText = eslintUtil.getText;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function isNodeDestructuring(node) {
  return node && (node.type === 'ArrayPattern' || node.type === 'ObjectPattern');
}

function isInRange(node, range) {
  return node.range[0] >= range[0] && node.range[1] <= range[1];
}

/**
 * Checks whether every reference to `variable` can be renamed to `newName`
 * without colliding with, shadowing, or capturing another binding.
 * @param {object} variable The scope variable to rename
 * @param {string} newName The new name
 * @returns {boolean}
 */
function canRenameVariable(variable, newName) {
  const declarationScope = variable.scope;

  // an unresolved `newName` inside the declaring scope would get captured by the renamed variable
  if (declarationScope.through.some((reference) => reference.identifier.name === newName)) {
    return false;
  }

  // a `newName` binding between a reference and the declaration would shadow the renamed variable
  // every reference resolves to `variable`, so walking up from it always reaches `declarationScope`
  return variable.references.every((reference) => {
    let scope = reference.from;
    while (!scope.set.has(newName)) {
      if (scope === declarationScope) {
        return true;
      }
      scope = scope.upper;
    }
    return false;
  });
}

/**
 * Builds the fixes that rename every reference of `variable` (except the ones inside `skipRange`)
 * to `newName`, keeping shorthand properties and exports pointing at the old public name.
 * @param {object} fixer The rule fixer
 * @param {object} variable The scope variable to rename
 * @param {string} newName The new name
 * @param {number[]} skipRange A range whose references are fixed separately
 * @returns {object[]}
 */
function renameReferences(fixer, variable, newName, skipRange) {
  return variable.references
    .map((reference) => reference.identifier)
    // eslint-scope reports a destructuring default target (`({ a = b } = c)`) twice
    .filter((identifier, index, identifiers) => identifiers.indexOf(identifier) === index)
    .filter((identifier) => !isInRange(identifier, skipRange))
    .map((identifier) => {
      const parent = identifier.parent;
      const property = parent.type === 'AssignmentPattern' && parent.left === identifier
        ? parent.parent
        : parent;
      const isShorthandProperty = property.type === 'Property'
        && property.shorthand
        && (property.value === identifier || property.value === parent);
      if (isShorthandProperty) {
        return fixer.replaceText(identifier, `${identifier.name}: ${newName}`);
      }

      const isShorthandExport = parent.type === 'ExportSpecifier'
        && parent.local === identifier
        && parent.exported.range[0] === identifier.range[0];
      if (isShorthandExport) {
        return fixer.replaceText(identifier, `${newName} as ${identifier.name}`);
      }

      return fixer.replaceText(identifier, newName);
    });
}

const messages = {
  useStateErrorMessage: 'useState call is not destructured into value + setter pair',
  useStateErrorMessageOrAddOption: 'useState call is not destructured into value + setter pair (you can allow destructuring by enabling "allowDestructuredState" option)',
  suggestPair: 'Destructure useState call into value + setter pair',
  suggestMemo: 'Replace useState call with useMemo',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Ensure destructuring and symmetric naming of useState hook value and setter variables',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('hook-use-state'),
    },
    messages,
    schema: [{
      type: 'object',
      properties: {
        allowDestructuredState: {
          default: false,
          type: 'boolean',
        },
      },
      additionalProperties: false,
    }],
    type: 'suggestion',
    hasSuggestions: true,
  },

  create: Components.detect((context, components, util) => {
    const configuration = context.options[0] || {};
    const allowDestructuredState = configuration.allowDestructuredState || false;

    return {
      CallExpression(node) {
        const isImmediateReturn = node.parent
          && node.parent.type === 'ReturnStatement';

        if (isImmediateReturn || !util.isReactHookCall(node, ['useState'])) {
          return;
        }

        const isDestructuringDeclarator = node.parent
          && node.parent.type === 'VariableDeclarator'
          && node.parent.id.type === 'ArrayPattern';

        if (!isDestructuringDeclarator) {
          report(
            context,
            messages.useStateErrorMessage,
            'useStateErrorMessage',
            {
              node,
              suggest: false,
            }
          );
          return;
        }

        const variableNodes = node.parent.id.elements;
        const valueVariable = variableNodes[0];
        const setterVariable = variableNodes[1];
        const isOnlyValueDestructuring = isNodeDestructuring(valueVariable) && !isNodeDestructuring(setterVariable);

        if (allowDestructuredState && isOnlyValueDestructuring) {
          return;
        }

        const valueVariableName = valueVariable
          ? valueVariable.name
          : undefined;

        const setterVariableName = setterVariable
          ? setterVariable.name
          : undefined;

        const caseCandidateMatch = valueVariableName ? valueVariableName.match(/(^[a-z]+)(.*)/) : undefined;
        const upperCaseCandidatePrefix = caseCandidateMatch ? caseCandidateMatch[1] : undefined;
        const caseCandidateSuffix = caseCandidateMatch ? caseCandidateMatch[2] : undefined;
        const expectedSetterVariableNames = upperCaseCandidatePrefix ? [
          `set${upperCaseCandidatePrefix.charAt(0).toUpperCase()}${upperCaseCandidatePrefix.slice(1)}${caseCandidateSuffix}`,
          `set${upperCaseCandidatePrefix.toUpperCase()}${caseCandidateSuffix}`,
        ] : [];

        const isSymmetricGetterSetterPair = valueVariable
          && setterVariable
          && expectedSetterVariableNames.indexOf(setterVariableName) !== -1
          && variableNodes.length === 2;

        if (!isSymmetricGetterSetterPair) {
          const suggestions = [
            Object.assign(
              getMessageData('suggestPair', messages.suggestPair),
              {
                fix(fixer) {
                  if (expectedSetterVariableNames.length > 0) {
                    const newSetterName = expectedSetterVariableNames[0];
                    const pairFix = fixer.replaceTextRange(
                      node.parent.id.range,
                      `[${valueVariableName}, ${newSetterName}]`
                    );

                    const setterScopeVariable = setterVariable && setterVariable.type === 'Identifier'
                      ? getDeclaredVariables(context, node.parent)
                        .find((variable) => variable.name === setterVariableName)
                      : undefined;

                    if (!setterScopeVariable || !canRenameVariable(setterScopeVariable, newSetterName)) {
                      return pairFix;
                    }

                    return [pairFix].concat(
                      renameReferences(fixer, setterScopeVariable, newSetterName, node.parent.id.range)
                    );
                  }
                },
              }
            ),
          ];

          const defaultReactImports = components.getDefaultReactImports();
          const defaultReactImportSpecifier = defaultReactImports
            ? defaultReactImports[0]
            : undefined;

          const defaultReactImportName = defaultReactImportSpecifier
            ? defaultReactImportSpecifier.local.name
            : undefined;

          const namedReactImports = components.getNamedReactImports();
          const useStateReactImportSpecifier = namedReactImports
            ? namedReactImports.find((specifier) => specifier.imported.name === 'useState')
            : undefined;

          const isSingleGetter = valueVariable && variableNodes.length === 1;
          const isUseStateCalledWithSingleArgument = node.arguments.length === 1;
          if (isSingleGetter && isUseStateCalledWithSingleArgument) {
            const useMemoReactImportSpecifier = namedReactImports
              && namedReactImports.find((specifier) => specifier.imported.name === 'useMemo');

            let useMemoCode;
            if (useMemoReactImportSpecifier) {
              useMemoCode = useMemoReactImportSpecifier.local.name;
            } else if (defaultReactImportName) {
              useMemoCode = `${defaultReactImportName}.useMemo`;
            } else {
              useMemoCode = 'useMemo';
            }

            suggestions.unshift(Object.assign(
              getMessageData('suggestMemo', messages.suggestMemo),
              {
                fix: (fixer) => [
                  // Add useMemo import, if necessary
                  useStateReactImportSpecifier
                    && (!useMemoReactImportSpecifier || defaultReactImportName)
                    && fixer.insertTextAfter(useStateReactImportSpecifier, ', useMemo'),
                  // Convert single-value destructure to simple assignment
                  fixer.replaceTextRange(node.parent.id.range, valueVariableName),
                  // Convert useState call to useMemo + arrow function + dependency array
                  fixer.replaceTextRange(
                    node.range,
                    `${useMemoCode}(() => ${getText(context, node.arguments[0])}, [])`
                  ),
                ].filter(Boolean),
              }
            ));
          }

          if (isOnlyValueDestructuring) {
            report(
              context,
              messages.useStateErrorMessageOrAddOption,
              'useStateErrorMessageOrAddOption',
              {
                node: node.parent.id,
                suggest: false,
              }
            );
            return;
          }

          report(
            context,
            messages.useStateErrorMessage,
            'useStateErrorMessage',
            {
              node: node.parent.id,
              suggest: suggestions,
            }
          );
        }
      },
    };
  }),
};
