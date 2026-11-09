/**
 * @fileoverview Enforce event handler naming conventions in JSX
 * @author Jake Marsh
 */

'use strict';

const minimatch = require('minimatch');
const docsUrl = require('../util/docsUrl');
const getText = require('../util/eslint').getText;
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  badHandlerName: 'Handler function for {{propKey}} prop key must be a camelCase name beginning with \'{{handlerPrefix}}\' only',
  badPropKey: 'Prop key for {{propValue}} must begin with \'{{handlerPropPrefix}}\'',
};

function isPrefixDisabled(prefix) {
  return prefix === false;
}

function isInlineHandler(expression) {
  return expression.type === 'ArrowFunctionExpression';
}

/**
 * Whether a conditional branch can never be a handler: `undefined`, `void 0`,
 * or a literal such as `null` or `false`.
 * @param {ASTNode} expression
 * @returns {boolean}
 */
function isNonHandlerBranch(expression) {
  return (expression.type === 'Identifier' && expression.name === 'undefined')
    || (expression.type === 'UnaryExpression' && expression.operator === 'void')
    || expression.type === 'Literal';
}

/**
 * Collects the expressions a conditional (ternary) handler can evaluate to,
 * walking nested conditionals and skipping branches that can't be a handler,
 * e.g. `cond ? undefined : this.handleClick` yields `[this.handleClick]`.
 * @param {ASTNode} expression a `ConditionalExpression`
 * @returns {ASTNode[]}
 */
function getConditionalBranches(expression) {
  return [expression.consequent, expression.alternate].reduce((branches, branch) => {
    if (branch.type === 'ConditionalExpression') {
      return branches.concat(getConditionalBranches(branch));
    }
    return isNonHandlerBranch(branch) ? branches : branches.concat(branch);
  }, []);
}

function getComponentName(node) {
  if (node.type === 'JSXIdentifier') {
    return node.name;
  }
  if (node.type === 'JSXMemberExpression') {
    return `${getComponentName(node.object)}.${node.property.name}`;
  }
  if (node.type === 'JSXNamespacedName') {
    return `${node.namespace.name}:${node.name.name}`;
  }
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Enforce event handler naming conventions in JSX',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-handler-names'),
    },

    messages,

    schema: [{
      anyOf: [
        {
          type: 'object',
          properties: {
            eventHandlerPrefix: { type: 'string' },
            eventHandlerPropPrefix: { type: 'string' },
            checkLocalVariables: { type: 'boolean' },
            checkInlineFunction: { type: 'boolean' },
            ignoreComponentNames: {
              type: 'array',
              uniqueItems: true,
              items: { type: 'string' },
            },
          },
          additionalProperties: false,
        }, {
          type: 'object',
          properties: {
            eventHandlerPrefix: { type: 'string' },
            eventHandlerPropPrefix: {
              type: 'boolean',
              enum: [false],
            },
            checkLocalVariables: { type: 'boolean' },
            checkInlineFunction: { type: 'boolean' },
            ignoreComponentNames: {
              type: 'array',
              uniqueItems: true,
              items: { type: 'string' },
            },
          },
          additionalProperties: false,
        }, {
          type: 'object',
          properties: {
            eventHandlerPrefix: {
              type: 'boolean',
              enum: [false],
            },
            eventHandlerPropPrefix: { type: 'string' },
            checkLocalVariables: { type: 'boolean' },
            checkInlineFunction: { type: 'boolean' },
            ignoreComponentNames: {
              type: 'array',
              uniqueItems: true,
              items: { type: 'string' },
            },
          },
          additionalProperties: false,
        }, {
          type: 'object',
          properties: {
            checkLocalVariables: { type: 'boolean' },
          },
          additionalProperties: false,
        }, {
          type: 'object',
          properties: {
            checkInlineFunction: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            ignoreComponentNames: {
              type: 'array',
              uniqueItems: true,
              items: { type: 'string' },
            },
          },
        },
      ],
    }],
  },

  create(context) {
    const configuration = context.options[0] || {};

    const eventHandlerPrefix = isPrefixDisabled(configuration.eventHandlerPrefix)
      ? null
      : configuration.eventHandlerPrefix || 'handle';
    const eventHandlerPropPrefix = isPrefixDisabled(configuration.eventHandlerPropPrefix)
      ? null
      : configuration.eventHandlerPropPrefix || 'on';

    const EVENT_HANDLER_REGEX = !eventHandlerPrefix
      ? null
      : new RegExp(`^((props\\.${eventHandlerPropPrefix || ''})|((.*\\.)?${eventHandlerPrefix}))[0-9]*[A-Z].*$`);
    const PROP_EVENT_HANDLER_REGEX = !eventHandlerPropPrefix
      ? null
      : new RegExp(`^(${eventHandlerPropPrefix}[A-Z].*|ref)$`);

    const checkLocal = !!configuration.checkLocalVariables;

    const checkInlineFunction = !!configuration.checkInlineFunction;

    const ignoreComponentNames = configuration.ignoreComponentNames || [];

    /**
     * Checks a single handler expression against the naming conventions.
     * @param {string} propKey the JSX attribute name
     * @param {ASTNode} expression the handler expression (a whole attribute value, or one ternary branch)
     * @param {ASTNode} reportNode the node to report on
     */
    function checkHandler(propKey, expression, reportNode) {
      if (
        (!checkInlineFunction && isInlineHandler(expression))
        || (
          !checkLocal
          && (isInlineHandler(expression)
            ? !expression.body.callee || !expression.body.callee.object
            : !expression.object
          )
        )
      ) {
        return;
      }

      const propValue = getText(
        context,
        checkInlineFunction && isInlineHandler(expression) ? expression.body.callee : expression
      ).replace(/\s*/g, '').replace(/^this\.|.*::/, '');

      const propIsEventHandler = PROP_EVENT_HANDLER_REGEX && PROP_EVENT_HANDLER_REGEX.test(propKey);
      const propFnIsNamedCorrectly = EVENT_HANDLER_REGEX && EVENT_HANDLER_REGEX.test(propValue);

      if (
        propIsEventHandler
        && propFnIsNamedCorrectly !== null
        && !propFnIsNamedCorrectly
      ) {
        report(context, messages.badHandlerName, 'badHandlerName', {
          node: reportNode,
          data: {
            propKey,
            handlerPrefix: eventHandlerPrefix,
          },
        });
      } else if (
        propFnIsNamedCorrectly
        && propIsEventHandler !== null
        && !propIsEventHandler
      ) {
        report(context, messages.badPropKey, 'badPropKey', {
          node: reportNode,
          data: {
            propValue,
            handlerPropPrefix: eventHandlerPropPrefix,
          },
        });
      }
    }

    return {
      JSXAttribute(node) {
        const componentName = getComponentName(node.parent.name);

        const isComponentNameIgnored = ignoreComponentNames.some((ignoredComponentNamePattern) => minimatch(
          componentName,
          ignoredComponentNamePattern
        ));

        if (
          !node.value
          || !node.value.expression
          || isComponentNameIgnored
        ) {
          return;
        }

        const propKey = typeof node.name === 'object' ? node.name.name : node.name;

        if (propKey === 'ref') {
          return;
        }

        const expression = node.value.expression;

        if (expression.type === 'ConditionalExpression') {
          // `onClick={disabled ? undefined : this.handleClick}`: check each
          // branch the handler can resolve to, and report on that branch.
          getConditionalBranches(expression).forEach((branch) => {
            checkHandler(propKey, branch, branch);
          });
          return;
        }

        checkHandler(propKey, expression, node);
      },
    };
  },
};
