/**
 * @fileoverview Standardize the way function component get defined
 * @author Stefan Wullems
 */

'use strict';

const arrayIncludes = require('array-includes');
const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const getMessageData = require('../util/message');
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
 * A function declaration exported with a live binding (`export function`, `export default function`, `export { name }`)
 * can't be converted safely: a module that imports it in an import cycle can call it before this module's body runs,
 * which only works because a function declaration is initialized before any code runs, and a variable is not.
 * @param {object} context
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isExportedWithLiveBinding(context, node) {
  if (node.type !== 'FunctionDeclaration' || !node.parent) {
    return false;
  }
  if (node.parent.type === 'ExportNamedDeclaration' || node.parent.type === 'ExportDefaultDeclaration') {
    return true;
  }
  const variable = node.id && getDeclaredVariables(context, node).find((v) => v.name === node.id.name);
  return !!variable && variable.references.some((ref) => ref.identifier.parent.type === 'ExportSpecifier');
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
 * Finds the scope whose code runs when the given scope's code does: its variable scope,
 * except that static class fields and static blocks run when the class is defined
 * @param {object} scope
 * @returns {object}
 */
function isStaticClassCode(scope) {
  if (scope.type === 'class-static-block') {
    return true;
  }
  const block = scope.block;
  const field = block.parent;
  const isStaticFieldValue = !!field
    && (field.type === 'PropertyDefinition' || field.type === 'ClassProperty')
    && field.value === block
    && !!field.static;
  // some parsers model a field's initializer as a function scope; a function value has its own scope below that
  return isStaticFieldValue
    && (scope.type === 'class-field-initializer' || (block.type !== 'FunctionExpression' && block.type !== 'ArrowFunctionExpression'));
}

function getRunningScope(scope) {
  let current = scope.variableScope;
  while (isStaticClassCode(current)) {
    current = current.upper.variableScope;
  }
  return current;
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
    && getRunningScope(scope) === variable.scope.variableScope;

  // `export { name }` doesn't read the binding; see `isExportedWithLiveBinding`
  return variable.references.some((ref) => ref.identifier.parent.type !== 'ExportSpecifier'
    && isEagerUseBefore(ref.identifier, ref.from))
    || jsxUses.some((use) => isEagerUseBefore(use.identifier, use.scope)
      && resolveVariable(use.scope, use.identifier.name) === variable);
}

/**
 * The uses of a variable: the references that read it, and the JSX elements that refer to it.
 * `export { name }` doesn't read the binding; see `isExportedWithLiveBinding`
 * @param {object} variable
 * @param {Array<{ identifier: ASTNode, scope: object }>} jsxUses
 * @returns {Array<{ identifier: ASTNode, scope: object }>}
 */
function getUses(variable, jsxUses) {
  return variable.references
    .filter((ref) => ref.isRead() && ref.identifier.parent.type !== 'ExportSpecifier')
    .map((ref) => ({ identifier: ref.identifier, scope: ref.from }))
    .concat(jsxUses.filter((use) => resolveVariable(use.scope, use.identifier.name) === variable));
}

/**
 * Finds the outermost function that contains a use, within the given variable scope
 * @param {object} scope the scope of the use
 * @param {object} variableScope
 * @returns {ASTNode | null} null if the use is directly in `variableScope`
 */
function getOutermostFunction(scope, variableScope) {
  let current = getRunningScope(scope);
  while (current !== variableScope && current.upper && getRunningScope(current.upper) !== variableScope) {
    current = getRunningScope(current.upper);
  }
  return current === variableScope ? null : current.block;
}

/**
 * Finds the declaration whose variable some code can only run through: `const f = () => {}`,
 * or a method, or a field's function or instance initializer, of a class that is declared or assigned to a variable
 * @param {ASTNode} fn a function, or a class field's initializer
 * @returns {ASTNode | null} a VariableDeclarator or ClassDeclaration
 */
function getBinding(fn) {
  const parent = fn.parent;
  const isFunction = fn.type === 'FunctionExpression' || fn.type === 'ArrowFunctionExpression';
  if (parent.type === 'VariableDeclarator') {
    return isFunction && parent.init === fn && parent.id.type === 'Identifier' ? parent : null;
  }
  const isClassField = (parent.type === 'PropertyDefinition' || parent.type === 'ClassProperty') && parent.value === fn;
  if (!(isFunction && parent.type === 'MethodDefinition') && !(isClassField && (isFunction || !parent.static))) {
    return null;
  }
  const classNode = parent.parent.parent;
  if (classNode.type === 'ClassDeclaration') {
    return classNode.id ? classNode : null;
  }
  const declarator = classNode.parent;
  return declarator.type === 'VariableDeclarator' && declarator.init === classNode && declarator.id.type === 'Identifier'
    ? declarator
    : null;
}

/**
 * Whether a function may be called before the code at `position` runs
 * @param {object} context
 * @param {ASTNode} fn
 * @param {number} position
 * @param {Array<{ identifier: ASTNode, scope: object }>} jsxUses
 * @param {Set<ASTNode>} visited functions already checked
 * @returns {boolean}
 */
function mayRunBefore(context, fn, position, jsxUses, visited) {
  if (visited.has(fn)) {
    return false;
  }
  visited.add(fn);
  // the variable that the function is called through
  let variable;
  if (fn.type === 'FunctionDeclaration') {
    // a function declaration can be called from anywhere, since it is hoisted
    if (!fn.id || isExportedWithLiveBinding(context, fn)) {
      return true;
    }
    variable = getDeclaredVariables(context, fn).find((v) => v.name === fn.id.name);
  } else {
    // any other function only exists once the code that creates it has run
    if (fn.range[0] > position) {
      return false;
    }
    const binding = getBinding(fn);
    if (!binding) {
      // e.g. a callback, which may be called right away
      return true;
    }
    variable = getDeclaredVariables(context, binding).find((v) => v.name === binding.id.name);
  }
  return !variable || getUses(variable, jsxUses).some((use) => {
    const outer = getOutermostFunction(use.scope, variable.scope.variableScope);
    return outer ? mayRunBefore(context, outer, position, jsxUses, visited) : use.identifier.range[0] < position;
  });
}

/**
 * Whether a function declaration may be used, from within another function, before its declaration runs.
 * Uses directly in its own scope are covered by `isUsedBeforeDeclaration`.
 * @param {object} context
 * @param {ASTNode} node
 * @param {Array<{ identifier: ASTNode, scope: object }>} jsxUses
 * @returns {boolean}
 */
function mayBeUsedEarlyFromFunction(context, node, jsxUses) {
  if (node.type !== 'FunctionDeclaration' || !node.id) {
    return false;
  }
  const variable = getDeclaredVariables(context, node).find((v) => v.name === node.id.name);
  if (!variable) {
    return false;
  }
  const visited = new Set([node]);
  return getUses(variable, jsxUses).some((use) => {
    const fn = getOutermostFunction(use.scope, variable.scope.variableScope);
    return !!fn && mayRunBefore(context, fn, node.range[0], jsxUses, visited);
  });
}

function isFunctionExpressionWithName(node) {
  return node.type === 'FunctionExpression' && node.id && node.id.name;
}

const messages = {
  'function-declaration': 'Function component is not a function declaration',
  'function-expression': 'Function component is not a function expression',
  'arrow-function': 'Function component is not an arrow function',
  'suggest-function-expression': 'Convert to a function expression (this can throw if it is used before its declaration runs, like from an import cycle)',
  'suggest-arrow-function': 'Convert to an arrow function (this can throw if it is used before its declaration runs, like from an import cycle)',
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
    hasSuggestions: true,

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
      const fix = getFixer(node, options.fixerOptions);
      // whether these are safe to convert depends on when other code runs, so only suggest it
      const suggestionId = `suggest-${options.messageId}`;
      const isSuggestion = !!fix && (
        isExportedWithLiveBinding(context, node)
        || mayBeUsedEarlyFromFunction(context, node, jsxUses)
      );
      reportC(context, messages[options.messageId], options.messageId, Object.assign(
        { node },
        isSuggestion
          ? { suggest: [Object.assign(getMessageData(suggestionId, messages[suggestionId]), { fix })] }
          : { fix }
      ));
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
