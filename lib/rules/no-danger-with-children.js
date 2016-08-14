/**
 * @fileoverview Report when a DOM element is using both children and dangerouslySetInnerHTML
 * @author David Petersen
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = {
  meta: {
    docs: {
      description: 'Report when a DOM element is using both children and dangerouslySetInnerHTML',
      category: '',
      recommended: false
    },
    schema: [] // no options
  },
  create: function(context) {
    return {
      JSXElement: function (node) {
        var hasChildren = false;
        var attributes = node.openingElement.attributes;

        if (node.children.length) {
          hasChildren = true;
        } else {
          var childrenProp = attributes.find(function (attribute) {
            return attribute.name.name === 'children';
          });
          if (childrenProp) {
            hasChildren = true;
          }
        }

        if (attributes && hasChildren) {
          var jsxElement = attributes.find(function (attribute) {
            return attribute.name.name === 'dangerouslySetInnerHTML';
          });


          if (jsxElement) {
            context.report(node, 'Only set one of `children` or `props.dangerouslySetInnerHTML`');
          }
        }
      },
      CallExpression: function (node) {
        if (
          node.callee
          && node.callee.type === 'MemberExpression'
          && node.callee.property.name === 'createElement'
          && node.arguments.length > 1
        ) {
          var hasChildren = false;

          var props = node.arguments[1].properties;
          var dangerously = props.find(function(prop) {
            return prop.key.name === 'dangerouslySetInnerHTML';
          });


          if (node.arguments.length === 2) {
            var childrenProp = props.find(function(prop) {
              return prop.key.name === 'children';
            });
            if (childrenProp) {
              hasChildren = true;
            }
          } else {
            hasChildren = true;
          }

          if (dangerously && hasChildren) {
            context.report(node, 'Only set one of `children` or `props.dangerouslySetInnerHTML`');
          }
        }
      }
    };
  }
};
