/**
 * @fileoverview Prevent missing props validation in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var declaredPropTypes = [];
  var usedPropTypes = [];
  var ignorePropsValidation = false;

  function isComponentDefinition(node) {
    return (
      node &&
      node.callee &&
      node.callee.object &&
      node.callee.property &&
      node.callee.object.name === 'React' &&
      node.callee.property.name === 'createClass'
    );
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {

    MemberExpression: function(node) {
      if (node.object.type !== 'ThisExpression' || node.property.name !== 'props' || !node.parent.property) {
        return;
      }
      usedPropTypes.push(node.parent.property.name);
    },

    ObjectExpression: function(node) {

      if (!isComponentDefinition(node.parent)) {
        return;
      }

      node.properties.forEach(function(property) {
        var keyName = property.key.name || property.key.value;
        if (keyName !== 'propTypes') {
          return;
        }
        if (property.value.type !== 'ObjectExpression') {
          ignorePropsValidation = true;
          return;
        }

        for (var i = 0, j = property.value.properties.length; i < j; i++) {
          declaredPropTypes.push(property.value.properties[i].key.name);
        }
      });
    },

    'ObjectExpression:exit': function(node) {

      if (!isComponentDefinition(node.parent)) {
        return;
      }

      for (var i = 0, j = usedPropTypes.length; !ignorePropsValidation && i < j; i++) {
        if (declaredPropTypes.indexOf(usedPropTypes[i]) !== -1 || usedPropTypes[i] === 'children') {
          continue;
        }
        context.report(node, '\'' + usedPropTypes[i] + '\' is missing in props validation');
      }

      declaredPropTypes.length = 0;
      usedPropTypes.length = 0;
      ignorePropsValidation = false;
    }
  };

};
