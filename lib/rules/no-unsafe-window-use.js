/**
 * @fileoverview Prevent unsafe window use
 * @author Johnny Zabala
 */

'use strict';

const arrayIncludes = require('array-includes');
const docsUrl = require('../util/docsUrl');
const Components = require('../util/Components');
const getNodeAncestors = require('../util/getNodeAncestors');

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

function isMethod(node) {
  return arrayIncludes(
    ['Property', 'MethodDefinition', 'ClassProperty'],
    node.type
  );
}

function isAllowedLifecycleMethod(methodNote) {
  return arrayIncludes(
    ['componentDidMount', 'componentDidUpdate', 'componentWillUnmount'],
    methodNote.key.name
  );
}

// guard: typeof window !== 'undefined'
function isGuard(node) {
  return (
    node.type === 'BinaryExpression'
    && (node.operator === '!==' || node.operator === '!=')
    && node.left.type === 'UnaryExpression'
    && node.left.operator === 'typeof'
    && node.right.type === 'Literal'
    && node.right.value === 'undefined'
  );
}

class Program {
  constructor(context, utils) {
    this.context = context;
    this.utils = utils;
    this.functionsUsingWindow = [];
    this.methodsUsingWindow = [];
    this.methodCalls = [];
    this.currentEventHandler = null;

    this.verifierFor = this.verifierFor.bind(this);
  }

  injectVerifier(fn) {
    this.currentEventHandler = null;
    const that = this;
    return function verifier() {
      return fn.apply(null, [that.verifierFor].concat(Array.from(arguments)));
    };
  }

  isInsideSafeZone(node) {
    const functionalComponent = this.utils.getParentStatelessComponent();
    const classComponent = !functionalComponent ? (
      this.utils.getParentES6Component() || this.utils.getParentES5Component()
    ) : null;
    return this.context
      .getAncestors()
      .reverse()
      .some(this.injectVerifier((verifierFor, ancestor, i, ancestors) => {
        const verifier = verifierFor({
          node: ancestor,
          reportNode: node,
          component: functionalComponent || classComponent
        });

        if (verifier.isGuard() || verifier.isAllowedHook() || verifier.isGuarded(ancestors[i - 1])) {
          return true;
        }

        if (functionalComponent) {
          return verifier.isSafeInsideFunctionalComponent();
        }

        if (classComponent) {
          return verifier.isSafeInsideClassComponent();
        }

        return false;
      }));
  }

  verifierFor(params) {
    params = params || {};
    const node = params.node;
    const reportNode = params.reportNode;
    const component = params.component;
    return {
      isGuard: () => isGuard(node),
      isAllowedHook: () => (
        node.type === 'CallExpression'
        && (arrayIncludes(['useEffect', 'useLayoutEffect', 'useCallback'], node.callee.name))
      ),
      isGuarded: (consequent) => {
        // Is protected by conditional
        if (
          (node.type === 'IfStatement' || node.type === 'ConditionalExpression')
          && isGuard(node.test)
          && (node.consequent === consequent)
        ) {
          return true;
        }
        // Is protected by logical AND expression
        if (
          node.type === 'LogicalExpression'
          && node.operator === '&&'
          && isGuard(node.left)) {
          return true;
        }
        return false;
      },
      isSafeInsideFunctionalComponent: () => {
        if (node === component) {
          if (this.currentEventHandler) {
            // Inside components we only care about handlers being called.
            // The last function before the component is the eventHandler.
            this.functionsUsingWindow.push({
              instance: this.currentEventHandler,
              node: reportNode,
              component
            });
            return true;
          }
          return false;
        }

        if (node.type === 'FunctionDeclaration') {
          this.currentEventHandler = node;
        } else if (
          node.type === 'ArrowFunctionExpression'
          && node.parent.type === 'VariableDeclarator'
        ) {
          this.currentEventHandler = node.parent;
        }

        return false;
      },
      isSafeInsideClassComponent: () => {
        if (node === component) {
          if (this.currentEventHandler) {
            // Inside components we only care about handlers being called.
            // The last method before the component is the eventHandler.
            this.methodsUsingWindow.push({
              instance: this.currentEventHandler,
              component,
              node: reportNode
            });
            return true;
          }
          return false;
        }

        if (isMethod(node)) {
          if (node.key.name === 'render' || node.key.name === 'constructor') {
            return false;
          }
          if (isAllowedLifecycleMethod(node)) {
            return true;
          }
          this.currentEventHandler = node;
        }
        return false;
      }
    };
  }

  report(node) {
    this.context.report({
      node,
      message: 'Unsafe "window" use'
    });
  }
}
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent unsafe window use',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('no-unsafe-window-use')
    }
  },
  create: Components.detect((context, _, utils) => {
    const program = new Program(context, utils);

    return {
      'Program:exit'() {
        // Check if component methods using 'window' were called by other methods safely.
        // eslint-disable-next-line no-cond-assign
        for (let method = null; method = program.methodsUsingWindow.pop();) {
          if (program.methodCalls.length > 0) {
            const unmatchedMethodCalls = [];
            // eslint-disable-next-line no-cond-assign
            for (let methodCall = null; methodCall = program.methodCalls.pop();) {
              // Check if the called method and the method using 'window'
              // have the same name and belong to the same component.
              if (
                methodCall.callee.property.name === method.instance.key.name
                && methodCall.component === method.component
              ) {
                // If the handler was called from another handler, add the new handler
                // to the list of methods using window so that we can find if the new
                // handler was called from another place.
                if (!getNodeAncestors(methodCall.callee)
                  .some(program.injectVerifier((verifierFor, ancestor, i, ancestors) => {
                    const verifier = verifierFor({
                      node: ancestor,
                      reportNode: method.node,
                      component: methodCall.component
                    });

                    if (verifier.isGuarded(ancestors[i - 1])) {
                      return true;
                    }

                    return verifier.isSafeInsideClassComponent();
                  }))) {
                  program.report(method.node);
                }
              } else {
                unmatchedMethodCalls.push(methodCall);
              }
            }
            program.methodCalls = unmatchedMethodCalls;
          }
        }

        // Check if component functions using 'window' were called by other functions safely.
        // eslint-disable-next-line no-cond-assign
        for (let fn = null; fn = program.functionsUsingWindow.pop();) {
          const variable = context.getDeclaredVariables(fn.instance)[0];
          variable.references.forEach(
            (reference) => {
              const node = reference.identifier.parent;
              if (
                node.type === 'CallExpression'
                // Check the called function is the function using window
                && node.callee.name === reference.identifier.name
              ) {
                // If the handler was called from another handler, add the new handler
                // to the list of functions using window so that we can find if the new
                // handler was called from another place.
                if (!getNodeAncestors(node)
                  .some(program.injectVerifier((verifierFor, ancestor, i, ancestors) => {
                    const verifier = verifierFor({
                      node: ancestor,
                      reportNode: fn.node,
                      component: fn.component
                    });

                    if (verifier.isAllowedHook() || verifier.isGuarded(ancestors[i - 1])) {
                      return true;
                    }

                    return verifier.isSafeInsideFunctionalComponent();
                  }))) {
                  program.report(fn.node);
                }
              }
            }
          );
        }
      },
      'Identifier[name="window"]'(node) {
        if (!program.isInsideSafeZone(node)) {
          program.report(node);
        }
      },
      'CallExpression[callee.type="MemberExpression"][callee.object.type="ThisExpression"]'(node) {
        const component = utils.getParentES6Component() || utils.getParentES5Component();
        if (component) {
          const method = context.getAncestors().reverse().find(isMethod);
          if (method && !isAllowedLifecycleMethod(method)) {
            program.methodCalls.push({
              instance: method,
              component,
              callee: node.callee
            });
          }
        }
      }
    };
  })
};
