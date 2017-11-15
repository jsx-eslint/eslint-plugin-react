'use strict';

const INLINE_ELEMENTS = [
  "a",
  "abbr",
  "acronym",
  "b",
  "bdo",
  "big",
  "br",
  "button",
  "cite",
  "code",
  "dfn",
  "em",
  "i",
  "img",
  "input",
  "kbd",
  "label",
  "map",
  "object",
  "q",
  "samp",
  "script",
  "select",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "textarea",
  "tt",
  "var"
];

module.exports = {
  meta: {
    docs: {
      description: 'Ensures inline tags are not rendered without spaces between them',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: false,
    schema: [
      {
        type: 'object',
        properties: {},
        default: {},
        additionalProperties: false
      }
    ]
  },
  create: function (context) {
    const sourceCode = context.getSourceCode();

    const isInlineElement = (node) => (
      node.type === 'JSXElement' &&
      node.openingElement &&
      node.openingElement.name &&
      node.openingElement.name.type === 'JSXIdentifier' &&
      INLINE_ELEMENTS.includes(node.openingElement.name.name)
    );

    return {
      JSXElement: function(node) {
        let lastChild = null;
        let child = null;
        let nextChild = null;
        (node.children.concat([null])).forEach((nextChild) => {
          if (
            (lastChild || nextChild) &&
            (!lastChild || isInlineElement(lastChild)) &&
            (child && child.type === 'Literal') &&
            (!nextChild || isInlineElement(nextChild)) &&
            true
          ) {
            if (lastChild && child.value.match(/^\s*\n\s*\S/)) {
              context.report({
                node: child,
                loc: child.loc,
                message: 'CASE A: ' + child.value,
              });
            } else if (lastChild && nextChild && child.value.match(/\n +$/)) {
              context.report({
                node: child,
                loc: child.loc,
                message: 'CASE B: ' + child.value,
              });
            } else if (nextChild && child.value.match(/\S\s*\n\s*$/)) {
              context.report({
                node: child,
                loc: child.loc,
                message: 'CASE C: ' + child.value,
              });
            } else if (lastChild && nextChild && child.value.match(/^ +\n/)) {
              context.report({
                node: child,
                loc: child.loc,
                message: 'CASE D: ' + child.value,
              });
            }
          }
          lastChild = child;
          child = nextChild;
        });
        Array.map
      },
    };
  }
};
