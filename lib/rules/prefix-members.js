/**
 * @fileoverview Enforce "_" prefix to user methods in a React component definition
 * @author Adrian Toncean
 */
'use strict';

var Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = Components.detect(function(context, components, utils) {
  var reactMemberNames = [
    'displayName',
    'propTypes',
    'contextTypes',
    'childContextTypes',
    'mixins',
    'statics',
    'defaultProps',
    'constructor',
    'getDefaultProps',
    'state',
    'getInitialState',
    'getChildContext',
    'componentWillMount',
    'componentDidMount',
    'componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'componentDidUpdate',
    'render',
    'componentWillUnmount'
  ];

  function isValid(name) {
    return name[0] === '_' || reactMemberNames.indexOf(name) !== -1;
  }

  function verifyMember(member) {
    if (
      !member.computed &&
      member.key && member.key.type === 'Identifier'
    ) {
      if (!isValid(member.key.name)) {
        context.report({
          node: member.key,
          message: 'User-defined component member "{{name}}" must be prefixed with an "_"',
          data: {
            name: member.key.name
          }
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {
    ObjectExpression: function(node) {
      if (utils.isES5Component(node)) {
        node.properties.forEach(verifyMember);
      }
    },
    ClassDeclaration: function(node) {
      if (utils.isES6Component(node)) {
        node.body.body.forEach(verifyMember);
      }
    }
  };
});

module.exports.schema = [];
