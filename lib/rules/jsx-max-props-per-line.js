/**
 * @fileoverview Limit maximum of props on a single line in JSX
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Limit maximum of props on a single line in JSX',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        maximum: {
          type: 'integer',
          minimum: 1
        },
        when: {
          type: 'string',
          enum: ['always', 'multiline']
        }
      }
    }]
  },

  create: function (context) {
    const sourceCode = context.getSourceCode();
    const configuration = context.options[0] || {};
    const maximum = configuration.maximum || 1;
    const when = configuration.when || 'always';

    function getPropName(propNode) {
      if (propNode.type === 'JSXSpreadAttribute') {
        return sourceCode.getText(propNode.argument);
      }
      return propNode.name.name;
    }

    function generateFixFunction(line, max) {
      const output = [];
      const front = line[0].start;
      const back = line[line.length - 1].end;
      for (let i = 0; i < line.length; i += max) {
        const nodes = line.slice(i, i + max);
        output.push(nodes.reduce((prev, curr) => {
          if (prev === '') {
            return sourceCode.getText(curr);
          }
          return `${prev} ${sourceCode.getText(curr)}`;
        }, ''));
      }
      const code = output.join('\n');
      return function(fixer) {
        return fixer.replaceTextRange([front, back], code);
      };
    }

    return {
      JSXOpeningElement: function (node) {
        if (!node.attributes.length) {
          return;
        }

        if (when === 'multiline' && node.loc.start.line === node.loc.end.line) {
          return;
        }

        const firstProp = node.attributes[0];
        const linePartitionedProps = [[firstProp]];

        node.attributes.reduce((last, decl) => {
          if (last.loc.end.line === decl.loc.start.line) {
            linePartitionedProps[linePartitionedProps.length - 1].push(decl);
          } else {
            linePartitionedProps.push([decl]);
          }
          return decl;
        });

        linePartitionedProps.forEach(propsInLine => {
          if (propsInLine.length > maximum) {
            const name = getPropName(propsInLine[maximum]);
            context.report({
              node: propsInLine[maximum],
              message: `Prop \`${name}\` must be placed on a new line`,
              fix: generateFixFunction(propsInLine, maximum)
            });
          }
        });
      }
    };
  }
};
