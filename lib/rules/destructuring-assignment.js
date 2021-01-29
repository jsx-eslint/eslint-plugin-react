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

  return {
    push(params) {
      queue.unshift(params);
    },
    pop() {
      queue.shift();
    },
    get propsName() {
      for (const params of queue) {
        const props = params[0];
        if (props && !props.destructuring && props.name) {
          return props.name;
        }
      }
      return null;
    },
    get contextName() {
      for (const params of queue) {
        const context = params[1];
        if (context && !context.destructuring && context.name) {
          return context.name;
        }
      }
      return null;
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
      const params = evalParams(node.params);

      const SFCComponent = components.get(context.getScope(node).block);
      if (!SFCComponent) {
        return;
      }
      sfcParams.push(params);

      if (params[0] && params[0].destructuring && components.get(node) && configuration === 'never') {
        context.report({
          node,
          message: 'Must never use destructuring props assignment in SFC argument'
        });
      } else if (params[1] && params[1].destructuring && components.get(node) && configuration === 'never') {
        context.report({
          node,
          message: 'Must never use destructuring context assignment in SFC argument'
        });
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
      const isPropUsed = (
        (sfcParams.propsName && node.object.name === sfcParams.propsName)
          || (sfcParams.contextName && node.object.name === sfcParams.contextName)
      )
        && !isAssignmentLHS(node);
      if (isPropUsed && configuration === 'always') {
        context.report({
          node,
          message: `Must use destructuring ${node.object.name} assignment`
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
        isPropUsed && configuration === 'always'
        && !(ignoreClassFields && isInClassProperty(node))
      ) {
        context.report({
          node,
          message: `Must use destructuring ${node.object.property.name} assignment`
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
        const SFCComponent = components.get(context.getScope(node).block);
        const classComponent = utils.getParentComponent(node);
        if (SFCComponent) {
          handleSFCUsage(node);
        }
        if (classComponent) {
          handleClassUsage(node);
        }
      },

      VariableDeclarator(node) {
        const classComponent = utils.getParentComponent(node);
        const SFCComponent = components.get(context.getScope(node).block);

        const destructuring = (node.init && node.id && node.id.type === 'ObjectPattern');
        // let {foo} = props;
        const destructuringSFC = destructuring && (node.init.name === 'props' || node.init.name === 'context');
        // let {foo} = this.props;
        const destructuringClass = destructuring && node.init.object && node.init.object.type === 'ThisExpression' && (
          node.init.property.name === 'props' || node.init.property.name === 'context' || node.init.property.name === 'state'
        );

        if (SFCComponent && destructuringSFC && configuration === 'never') {
          context.report({
            node,
            message: `Must never use destructuring ${node.init.name} assignment`
          });
        }

        if (
          classComponent && destructuringClass && configuration === 'never'
          && !(ignoreClassFields && node.parent.type === 'ClassProperty')
        ) {
          context.report({
            node,
            message: `Must never use destructuring ${node.init.property.name} assignment`
          });
        }
      }
    };
  })
};
