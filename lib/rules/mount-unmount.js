/**
 * @fileoverview code that call React.render are responsible for calling
 * React.unmountComponentAtNode
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'code that call React.render are responsible for calling React.unmountComponentAtNode',
      category: 'Best Practices',
      recommended: false
    },
    schema: []
  },

  create: function(context) {
    var renderNodes = [];
    var unmountNodes = [];

    function findRenderTarget(expression) {
      if (expression.type === 'CallExpression' &&
        expression.callee.type === 'MemberExpression' &&
        expression.callee.object.name === 'ReactDOM' &&
        expression.callee.property.name === 'render' &&
        expression.arguments.length === 2) {
        var targetNode = expression.arguments[1];
        renderNodes.push(targetNode);
      }
    }
    function findUnmountTarget(expression) {
      if (expression.type === 'CallExpression' &&
        expression.callee.type === 'MemberExpression' &&
        expression.callee.object.name === 'ReactDOM' &&
        expression.callee.property.name === 'unmountComponentAtNode' &&
        expression.arguments.length === 1) {
        var targetNode = expression.arguments[0];
        unmountNodes.push(targetNode);
      }
    }

    function programExit() {

      var sourceCode = context.eslint.getSourceCode().text;
      var renders = renderNodes.map(function(node) {
        return {
          node: node,
          text: sourceCode.slice(node.start, node.end)
        };
      });
      var unmounts = unmountNodes.map(function(node) {
        return {
          node: node,
          text: sourceCode.slice(node.start, node.end)
        };
      });

      var notUnmounts = renders.filter(function(render) {
        return !unmounts.some(function(unmount) {
          return unmount.text === render.text;
        });
      });
      var notRendereds = unmounts.filter(function(unmount) {
        return !renders.some(function(render) {
          return render.text === unmount.text;
        });
      });

      notUnmounts.forEach(function(notUnmount) {
        context.report({
          node: notUnmount.node,
          message: '\'' + notUnmount.text + '\' was never unmounted'
        });
      });
      notRendereds.forEach(function(notRendered) {
        context.report({
          node: notRendered.node,
          message: '\'' + notRendered.text + '\' was never rendered'
        });
      });
    }

    return {
      'CallExpression:exit': function(functionNode) {
        findRenderTarget(functionNode);
        findUnmountTarget(functionNode);
      },
      'Program:exit': programExit
    };
  }
};
