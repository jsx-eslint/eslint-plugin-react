/**
 * @fileoverview Prevent unused state or using state that has never been set
 * @author Thai Pangsakulyanont @ Taskworld.com
 */
'use strict';

var componentUtil = require('../util/component');
var ComponentList = componentUtil.List;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var componentList = new ComponentList();

  /**
   * Returns a function that takes a path, and returns the property by following
   * along that path, starting from a node. If along the way, a falsy value is
   * encountered, it will be returned instead. This is similar to Lo-Dash’s
   * `_.propertyOf`.
   *
   * @param {ASTNode} node The node to traverse.
   * @returns {Function} A function that takes a path, and returns the value.
   */
  function getter(node) {
    return function(path) {
      var item = node;
      var props = path.split('.');
      for (var i = 0; i < props.length; i++) {
        if (!item) {
          return item;
        }
        item = item[props[i]];
      }
      return item;
    };
  }

  function reportUnused(items) {
    items.forEach(function(item) {
      context.report(item.node, 'Unused state ' + item.name);
    });
  }

  function reportUndeclared(items) {
    items.forEach(function(item) {
      context.report(item.node, 'Undeclared state ' + item.name);
    });
  }

  function validateComponentStateUsage(component) {
    var usage = component.stateUsage || [];
    var declarations = component.stateDeclarations || [];
    var used = {};
    var declared = {};
    var has = Object.prototype.hasOwnProperty;
    declarations.forEach(function(item) {
      (declared[item.name] || (declared[item.name] = [])).push(item);
    });
    usage.forEach(function(item) {
      (used[item.name] || (used[item.name] = [])).push(item);
    });
    var name;
    for (name in declared) {
      if (has.call(declared, name) && !has.call(used, name)) {
        reportUnused(declared[name]);
      }
    }
    for (name in used) {
      if (has.call(used, name) && !has.call(declared, name)) {
        reportUndeclared(used[name]);
      }
    }
  }

  function isSetState(node) {
    var get = getter(node);
    if (get('parent.type') === 'ReturnStatement') {
      return (
        get('parent.parent.type') === 'BlockStatement' &&
        get('parent.parent.parent.type') === 'FunctionExpression' &&
        get('parent.parent.parent.parent.key.name') === 'getInitialState'
      );
    }
    if (get('parent.type') === 'CallExpression') {
      return (
        get('parent.callee.object.type') === 'ThisExpression' &&
        get('parent.callee.property.name') === 'setState'
      );
    }
  }

  return {

    ObjectExpression: function(node) {
      componentList.set(context, node);
      if (!isSetState(node)) {
        return;
      }
      node.properties.forEach(function(property) {
        var get = getter(property);
        var stateName = get('key.name');
        if (!stateName) {
          return;
        }
        var component = componentList.getByNode(context, node);
        var stateDeclarations = component && component.stateDeclarations || [];
        stateDeclarations.push({name: stateName, node: property});
        componentList.set(context, node, {stateDeclarations: stateDeclarations});
      });
    },

    ClassDeclaration: function(node) {
      componentList.set(context, node);
    },

    MemberExpression: function(node) {
      var get = getter(node);
      if (
        get('object.type') !== 'MemberExpression' ||
        get('property.type') !== 'Identifier' ||
        get('object.property.name') !== 'state' ||
        get('object.object.type') !== 'ThisExpression'
      ) {
        return;
      }
      var stateName = node.property.name;
      var component = componentList.getByNode(context, node);
      var stateUsage = component && component.stateUsage || [];
      stateUsage.push({name: stateName, node: node});
      componentList.set(context, node, {stateUsage: stateUsage});
    },

    'Program:exit': function() {
      var list = componentList.getList();
      for (var component in list) {
        if (!list.hasOwnProperty(component)) {
          continue;
        }
        validateComponentStateUsage(list[component]);
      }
    }
  };
};

module.exports.schema = [
];
