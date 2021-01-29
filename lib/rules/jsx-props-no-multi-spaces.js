/**
 * @fileoverview Disallow multiple spaces between inline JSX props
 * @author Adrian Moennich
 */

'use strict';

const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow multiple spaces between inline JSX props',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-props-no-multi-spaces')
    },
    fixable: 'code',
    schema: []
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    function getPropName(propNode) {
      switch (propNode.type) {
        case 'JSXSpreadAttribute':
          return context.getSourceCode().getText(propNode.argument);
        case 'JSXIdentifier':
          return propNode.name;
        case 'JSXMemberExpression':
          return `${getPropName(propNode.object)}.${propNode.property.name}`;
        default:
          return propNode.name.name;
      }
    }

    // First and second must be adjacent nodes
    function hasEmptyLines(first, second) {
      const comments = sourceCode.getCommentsBefore(second);
      const nodes = [].concat(first, comments, second);

      for (let i = 1; i < nodes.length; i += 1) {
        const prev = nodes[i - 1];
        const curr = nodes[i];
        if (curr.loc.start.line - prev.loc.end.line >= 2) {
          return true;
        }
      }

      return false;
    }

    function checkSpacing(prev, node) {
      if (hasEmptyLines(prev, node)) {
        context.report({
          node,
          message: `Expected no line gap between “${getPropName(prev)}” and “${getPropName(node)}”`
        });
      }

      if (prev.loc.end.line !== node.loc.end.line) {
        return;
      }

      const between = context.getSourceCode().text.slice(prev.range[1], node.range[0]);

      if (between !== ' ') {
        context.report({
          node,
          message: `Expected only one space between "${getPropName(prev)}" and "${getPropName(node)}"`,
          fix(fixer) {
            return fixer.replaceTextRange([prev.range[1], node.range[0]], ' ');
          }
        });
      }
    }

    function containsGenericType(node) {
      const containsTypeParams = typeof node.typeParameters !== 'undefined';
      return containsTypeParams && node.typeParameters.type === 'TSTypeParameterInstantiation';
    }

    function getGenericNode(node) {
      const name = node.name;
      if (containsGenericType(node)) {
        const type = node.typeParameters;

        return Object.assign(
          {},
          node,
          {
            range: [
              name.range[0],
              type.range[1]
            ]
          }
        );
      }

      return name;
    }

    return {
      JSXOpeningElement(node) {
        node.attributes.reduce((prev, prop) => {
          checkSpacing(prev, prop);
          return prop;
        }, getGenericNode(node));
      }
    };
  }
};
