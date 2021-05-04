/**
 * @fileoverview Enforce consistent usage of destructuring assignment of props, state, and context.
 */

'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const isAssignmentLHS = require('../util/ast').isAssignmentLHS;

const DEFAULT_OPTION = 'always';

function createSFCParams() {
  const queue = [];

  const identifyProps = (params) => {
    const props = params[0];
    return props && !props.destructuring && props.name;
  };

  const identifyContext = (params) => {
    const context = params[1];
    return context && !context.destructuring && context.name;
  };

  return {
    push(params) {
      queue.unshift(params);
    },
    pop() {
      queue.shift();
    },
    propsName() {
      const found = queue.find(identifyProps);
      return found && found[0] && found[0].name;
    },
    contextName() {
      const found = queue.find(identifyContext);
      return found && found[1] && found.name;
    }
  };
}

function evalParams(params) {
  return params.map((param) => ({
    destructuring: param.type === 'ObjectPattern',
    name: param.type === 'Identifier' && param.name
  }));
}

module.exports = {
  meta: {
    docs: {
      description: 'Enforce consistent usage of destructuring assignment of props, state, and context',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('destructuring-assignment')
    },

    messages: {
      noDestructPropsInSFCArg: 'Must never use destructuring props assignment in SFC argument',
      noDestructContextInSFCArg: 'Must never use destructuring context assignment in SFC argument',
      noDestructAssignment: 'Must never use destructuring {{type}} assignment',
      useDestructAssignment: 'Must use destructuring {{type}} assignment'
    },

    schema: [{
      type: 'string',
      enum: [
        'always',
        'never'
      ]
    }, {
      type: 'object',
      properties: {
        ignoreClassFields: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: Components.detect((context, components, utils) => {
    const configuration = context.options[0] || DEFAULT_OPTION;
    const ignoreClassFields = (context.options[1] && (context.options[1].ignoreClassFields === true)) || false;
    const sfcParams = createSFCParams();

    /**
     * @param {ASTNode} node We expect either an ArrowFunctionExpression,
     *   FunctionDeclaration, or FunctionExpression
     */
    function handleStatelessComponent(node) {
      const SFCComponent = components.get(context.getScope(node).block);
      if (!SFCComponent) {
        return;
      }
      const params = evalParams(node.params);

      sfcParams.push(params);

      if (configuration === 'never') {
        if (params[0] && params[0].destructuring && components.get(node)) {
          context.report({
            node,
            messageId: 'noDestructPropsInSFCArg'
          });
        } else if (params[1] && params[1].destructuring && components.get(node)) {
          context.report({
            node,
            messageId: 'noDestructContextInSFCArg'
          });
        }
      }
    }

    function handleStatelessComponentExit(node) {
      const SFCComponent = components.get(context.getScope(node).block);
      if (SFCComponent) {
        sfcParams.pop();
      }
    }

    function handleSFCUsage(node) {
      // props.aProp || context.aProp
      const isPropUsed = node.object.name && (
        node.object.name === sfcParams.propsName() || node.object.name === sfcParams.contextName()
      ) && !isAssignmentLHS(node);
      if (isPropUsed) {
        context.report({
          node,
          messageId: 'useDestructAssignment',
          data: {
            type: node.object.name
          }
        });
      }
    }

    function isInClassProperty(node) {
      let curNode = node.parent;
      while (curNode) {
        if (curNode.type === 'ClassProperty') {
          return true;
        }
        curNode = curNode.parent;
      }
      return false;
    }

    function handleClassUsage(node) {
      // this.props.Aprop || this.context.aProp || this.state.aState
      const isPropUsed = (
        node.object.type === 'MemberExpression' && node.object.object.type === 'ThisExpression'
        && (node.object.property.name === 'props' || node.object.property.name === 'context' || node.object.property.name === 'state')
        && !isAssignmentLHS(node)
      );

      if (
        isPropUsed && !(ignoreClassFields && isInClassProperty(node))
      ) {
        context.report({
          node,
          messageId: 'useDestructAssignment',
          data: {
            type: node.object.property.name
          }
        });
      }
    }

    return {

      FunctionDeclaration: handleStatelessComponent,

      ArrowFunctionExpression: handleStatelessComponent,

      FunctionExpression: handleStatelessComponent,

      'FunctionDeclaration:exit': handleStatelessComponentExit,

      'ArrowFunctionExpression:exit': handleStatelessComponentExit,

      'FunctionExpression:exit': handleStatelessComponentExit,

      MemberExpression(node) {
        if (configuration === 'always') {
          const SFCComponent = components.get(context.getScope(node).block);
          const classComponent = utils.getParentComponent(node);
          if (SFCComponent) {
            handleSFCUsage(node);
          }
          if (classComponent) {
            handleClassUsage(node);
          }
        }
      },

      VariableDeclarator(node) {
        if (configuration === 'never') {
          const destructuring = (node.init && node.id && node.id.type === 'ObjectPattern');
          // let {foo} = props;
          const destructuringSFC = destructuring && (node.init.name === 'props' || node.init.name === 'context');
          // let {foo} = this.props;
          const destructuringClass = destructuring && node.init.object && node.init.object.type === 'ThisExpression' && (
            node.init.property.name === 'props' || node.init.property.name === 'context' || node.init.property.name === 'state'
          );

          if (destructuringSFC && components.get(context.getScope(node).block)) {
            context.report({
              node,
              messageId: 'noDestructAssignment',
              data: {
                type: node.init.name
              }
            });
          }

          if (
            destructuringClass
            && !(ignoreClassFields && node.parent.type === 'ClassProperty')
            && utils.getParentComponent(node)
          ) {
            context.report({
              node,
              messageId: 'noDestructAssignment',
              data: {
                type: node.init.property.name
              }
            });
          }
        }
      }
    };
  })
};
