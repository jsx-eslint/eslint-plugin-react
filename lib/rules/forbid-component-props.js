/**
 * @fileoverview Forbid certain props on components
 * @author Joe Lencioni
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var DEFAULTS = {
  properties: ['className', 'style'],
  allowOnDOM: true,
  allowOnComponents: false,
  forbid: []
};

function isDOMNode(tag) {
  return tag[0] !== tag[0].toUpperCase();
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Forbid certain props on components',
      category: 'Best Practices',
      recommended: false
    },

    schema: [
      {
        type: 'object',
        properties: {
          defaultAllowOnDOM: {
            type: 'boolean'
          },
          forbid: {
            type: 'array',
            items: {
              oneOf: [
                {
                  type: 'string'
                },
                {
                  type: 'object',
                  properties: {
                    property: {
                      type: 'string'
                    },
                    allowOnDOM: {
                      type: 'boolean'
                    },
                    allowOnComponents: {
                      type: 'boolean'
                    },
                    forbid: {
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    }
                  }
                }
              ]
            }
          }
        },
        additionalProperties: true
      }
    ]
  },

  create: function(context) {
    var configuration = context.options[0] || {};
    var forbid = configuration.forbid || DEFAULTS.properties;

    function getDefaultRule() {
      return {
        allowOnDOM: Object.prototype.hasOwnProperty.call(configuration, 'defaultAllowOnDOM') ?
            configuration.allowOnComponents : DEFAULTS.allowOnDOM,
        allowOnComponents: Object.prototype.hasOwnProperty.call(configuration, 'defaultAllowOnComponents') ?
            configuration.defaultAllowOnComponents : DEFAULTS.allowOnComponents,
        forbid: [],
        allow: []
      };
    }

    function getForbidden(input) {
      var forbidden = {};

      for (var i = 0; i < input.length; i++) {
        var rule = input[i];
        if (typeof rule === 'string') {
          rule = {
            property: rule
          };
        }

        forbidden[rule.property] = Object.assign(getDefaultRule(), rule);
      }

      return forbidden;
    }

    var rules = getForbidden(forbid);

    function isForbidden(prop, tag) {
      return rules[prop] &&
          rules[prop].allow.indexOf(tag) === -1 && (
              rules[prop].forbid.indexOf(tag) > -1
              || (isDOMNode(tag) && !rules[prop].allowOnDOM)
              || (!isDOMNode(tag) && !rules[prop].allowOnComponents)
          );
    }

    function getError(prop, tag) {
      if (rules[prop].forbid.indexOf(tag) > -1) {
        return 'Prop `' + prop + '` is specifically forbidden on tags named ' + tag;
      } else if (isDOMNode(tag)) {
        return 'Prop `' + prop + '` is forbidden on DOM nodes';
      }

      return 'Prop `' + prop + '` is forbidden on Components';
    }

    return {
      JSXAttribute: function(node) {
        var tag = node.parent.name.name;
        var prop = node.name.name;

        if (!isForbidden(prop, tag)) {
          return;
        }

        context.report({
          node: node,
          message: getError(prop, tag)
        });
      }
    };
  }
};

