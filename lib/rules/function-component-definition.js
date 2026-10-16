/**
 * @fileoverview Standardize the way function component get defined
 * @author Stefan Wullems
 */

'use strict';

const arrayIncludes = require('array-includes');
const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const reportC = require('../util/report');
const eslintUtil = require('../util/eslint');

const getDeclaredVariables = eslintUtil.getDeclaredVariables;
const getScope = eslintUtil.getScope;
const getText = eslintUtil.getText;
const propsUtil = require('../util/props');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function buildFunction(template, parts) {
  return Object.keys(parts).reduce(
    (acc, key) => acc.replace(`{${key}}`, () => parts[key] || ''),
    template
  );
}

const NAMED_FUNCTION_TEMPLATES = {
  'function-declaration': 'function {name}{typeParams}({params}){returnType} {body}',
  'arrow-function': '{varType} {name}{typeAnnotation} = {typeParams}({params}){returnType} => {body}',
  'function-expression': '{varType} {name}{typeAnnotation} = function{typeParams}({params}){returnType} {body}',
};

const UNNAMED_FUNCTION_TEMPLATES = {
  'function-expression': 'function{typeParams}({params}){returnType} {body}',
  'arrow-function': '{typeParams}({params}){returnType} => {body}',
};

function hasOneUnconstrainedTypeParam(node) {
  const nodeTypeArguments = propsUtil.getTypeArguments(node);

  return nodeTypeArguments
    && nodeTypeArguments.params
    && nodeTypeArguments.params.length === 1
    && !nodeTypeArguments.params[0].constraint;
}

function hasName(node) {
  return (
    node.type === 'FunctionDeclaration'
    || node.parent.type === 'VariableDeclarator'
  );
}

function getNodeText(prop, source) {
  if (!prop) return null;
  return source.slice(prop.range[0], prop.range[1]);
}

function getName(node) {
  if (node.type === 'FunctionDeclaration') {
    return node.id.name;
  }

  if (
    node.type === 'ArrowFunctionExpression'
    || node.type === 'FunctionExpression'
  ) {
    return hasName(node) && node.parent.id.name;
  }
}

function getParams(node, source) {
  if (node.params.length === 0) return null;
  return source.slice(
    node.params[0].range[0],
    node.params[node.params.length - 1].range[1]
  );
}

function getBody(node, source) {
  const range = node.body.range;

  if (node.body.type !== 'BlockStatement') {
    return ['{', `  return ${source.slice(range[0], range[1])}`, '}'].join('\n');
  }

  return source.slice(range[0], range[1]);
}

function getTypeAnnotation(node, source) {
  if (!hasName(node) || node.type === 'FunctionDeclaration') return;

  if (
    node.type === 'ArrowFunctionExpression'
    || node.type === 'FunctionExpression'
  ) {
    return getNodeText(node.parent.id.typeAnnotation, source);
  }
}

function isUnfixableBecauseOfExport(node) {
  return (
    node.type === 'FunctionDeclaration'
    && node.parent
    && node.parent.type === 'ExportDefaultDeclaration'
  );
}

/**
 * Finds the variable that a name refers to, from the given scope
 * @param {object} scope
 * @param {string} name
 * @returns {object | null}
 */
function resolveVariable(scope, name) {
  for (let current = scope; current; current = current.upper) {
    const variable = current.set.get(name);
    if (variable) {
      return variable;
    }
  }
  return null;
}

/**
 * A function declaration is hoisted, but a `const` is not (and a `var` is `undefined` until assigned).
 * Converting a declaration that is used earlier in the source would break that use,
 * when it runs before the declaration: in the same function body, or at the top level.
 * A use inside a nested function only runs when that function is called, which is usually later.
 * @param {object} context
 * @param {ASTNode} node
 * @param {Array<{ identifier: ASTNode, scope: object }>} jsxUses
 *   JSX element names, since eslint-scope does not create references for them
 * @returns {boolean}
 */
function isUsedBeforeDeclaration(context, node, jsxUses) {
  if (node.type !== 'FunctionDeclaration' || !node.id) {
    return false;
  }
  const variable = getDeclaredVariables(context, node).find((v) => v.name === node.id.name);
  if (!variable) {
    return false;
  }

  const isEagerUseBefore = (identifier, scope) => identifier.range[0] < node.range[0]
    && scope.variableScope === variable.scope.variableScope;

  return variable.references.some((ref) => isEagerUseBefore(ref.identifier, ref.from))
    || jsxUses.some((use) => isEagerUseBefore(use.identifier, use.scope)
      && resolveVariable(use.scope, use.identifier.name) === variable);
}

function isFunctionExpressionWithName(node) {
  return node.type === 'FunctionExpression' && node.id && node.id.name;
}

const messages = {
  'function-declaration': 'Function component is not a function declaration',
  'function-expression': 'Function component is not a function expression',
  'arrow-function': 'Function component is not an arrow function',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Enforce a specific function type for function components',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('function-component-definition'),
    },
    fixable: 'code',

    messages,

    schema: [
      {
        type: 'object',
        properties: {
          namedComponents: {
            anyOf: [
              {
                enum: [
                  'function-declaration',
                  'arrow-function',
                  'function-expression',
                ],
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                  enum: [
                    'function-declaration',
                    'arrow-function',
                    'function-expression',
                  ],
                },
              },
            ],
          },
          unnamedComponents: {
            anyOf: [
              { enum: ['arrow-function', 'function-expression'] },
              {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['arrow-function', 'function-expression'],
                },
              },
            ],
          },
        },
      },
    ],
  },

  create: Components.detect((context, components) => {
    const configuration = context.options[0] || {};
    let fileVarType = 'var';
    // JSX element names, collected until `Program:exit` when components are validated
    const jsxUses = [];

    const namedConfig = [].concat(
      configuration.namedComponents || 'function-declaration'
    );
    const unnamedConfig = [].concat(
      configuration.unnamedComponents || 'function-expression'
    );

    function getFixer(node, options) {
      const source = getText(context);

      const typeAnnotation = getTypeAnnotation(node, source);

      if (options.type === 'function-declaration' && typeAnnotation) {
        return;
      }
      if (options.type === 'arrow-function' && hasOneUnconstrainedTypeParam(node)) {
        return;
      }
      if (isUnfixableBecauseOfExport(node)) return;
      if (isFunctionExpressionWithName(node)) return;
      if (options.type !== 'function-declaration' && isUsedBeforeDeclaration(context, node, jsxUses)) return;
      let varType = fileVarType;
      if (
        (node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression')
        && node.parent.type === 'VariableDeclarator'
      ) {
        varType = node.parent.parent.kind;
      }

      const nodeTypeArguments = propsUtil.getTypeArguments(node);
      return (fixer) => fixer.replaceTextRange(
        options.range,
        buildFunction(options.template, {
          typeAnnotation,
          typeParams: getNodeText(nodeTypeArguments, source),
          params: getParams(node, source),
          returnType: getNodeText(node.returnType, source),
          body: getBody(node, source),
          name: getName(node),
          varType,
        })
      );
    }

    function report(node, options) {
      reportC(context, messages[options.messageId], options.messageId, {
        node,
        fix: getFixer(node, options.fixerOptions),
      });
    }

    function validate(node, functionType) {
      if (!components.get(node)) return;

      if (node.parent && node.parent.type === 'Property') return;

      if (hasName(node) && !arrayIncludes(namedConfig, functionType)) {
        report(node, {
          messageId: namedConfig[0],
          fixerOptions: {
            type: namedConfig[0],
            template: NAMED_FUNCTION_TEMPLATES[namedConfig[0]],
            range:
              node.type === 'FunctionDeclaration'
                ? node.range
                : node.parent.parent.range,
          },
        });
      }
      if (!hasName(node) && !arrayIncludes(unnamedConfig, functionType)) {
        report(node, {
          messageId: unnamedConfig[0],
          fixerOptions: {
            type: unnamedConfig[0],
            template: UNNAMED_FUNCTION_TEMPLATES[unnamedConfig[0]],
            range: node.range,
          },
        });
      }
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------
    const validatePairs = [];
    let hasES6OrJsx = false;
    return {
      FunctionDeclaration(node) {
        validatePairs.push([node, 'function-declaration']);
      },
      ArrowFunctionExpression(node) {
        validatePairs.push([node, 'arrow-function']);
      },
      FunctionExpression(node) {
        validatePairs.push([node, 'function-expression']);
      },
      JSXOpeningElement(node) {
        if (node.name.type === 'JSXIdentifier') {
          jsxUses.push({ identifier: node.name, scope: getScope(context, node) });
        }
      },
      VariableDeclaration(node) {
        hasES6OrJsx = hasES6OrJsx || node.kind === 'const' || node.kind === 'let';
      },
      'Program:exit'() {
        if (hasES6OrJsx) fileVarType = 'const';
        validatePairs.forEach((pair) => validate(pair[0], pair[1]));
      },
      'ImportDeclaration, ExportNamedDeclaration, ExportDefaultDeclaration, ExportAllDeclaration, ExportSpecifier, ExportDefaultSpecifier, JSXElement, TSExportAssignment, TSImportEqualsDeclaration'() {
        hasES6OrJsx = true;
      },
    };
  }),
};
