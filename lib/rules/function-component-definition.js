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

function findDeclaredVariable(scope, node) {
  const variable = scope.variables.find((v) => v.defs.some((def) => def.node === node));
  if (variable) return variable;
  for (let i = 0; i < scope.childScopes.length; i += 1) {
    const found = findDeclaredVariable(scope.childScopes[i], node);
    if (found) return found;
  }
  return null;
}

/**
 * A function declaration is hoisted, but a `const` is not.
 * Converting a declaration that is referenced earlier in the source
 * would turn a working reference into a TDZ `ReferenceError`.
 * This is deliberately conservative: any reference that appears before
 * the declaration blocks the fix, even one inside a deferred function body.
 * @param {object} context
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isUsedBeforeDeclaration(context, node) {
  if (node.type !== 'FunctionDeclaration' || !node.id) return false;

  // on older ESLint, `context.getScope()` returns the scope of the node currently being traversed,
  // not of `node`, so search down from the root scope instead
  let scope = getScope(context, node);
  while (scope.upper) scope = scope.upper;
  const variable = findDeclaredVariable(scope, node);
  if (!variable) return false;

  return variable.references.some((ref) => ref.identifier.range[0] < node.range[0]);
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
      if (options.type !== 'function-declaration' && isUsedBeforeDeclaration(context, node)) return;
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
