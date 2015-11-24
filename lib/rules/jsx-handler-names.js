/**
 * @fileoverview Enforce event handler naming conventions in JSX
 * @author Jake Marsh
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var configuration = context.options[0] || {};
  var eventHandlerPrefix = configuration.eventHandlerPrefix || 'handle';
  var eventHandlerPropPrefix = configuration.eventHandlerPropPrefix || 'on';

  var EVENT_HANDLER_REGEX = new RegExp('^((this\.props\.' + eventHandlerPropPrefix + ')'
                                       + '|((.*\.)?' + eventHandlerPrefix + ')).+$');
  var PROP_EVENT_HANDLER_REGEX = new RegExp('^' + eventHandlerPropPrefix + '.+$');

  /**
   * Get full prop value for a handler, i.e. `this.props.<name>`
   * @param {Object} node.value.expression for JSXAttribute
   * @return {String} Full prop value
   */
  function rebuildPropValue(valueNode) {
    var valueNodeObject = valueNode.object;
    var subObjectType = valueNodeObject.object ? valueNodeObject.object.type : '';
    var propertyName = valueNodeObject.property ? valueNodeObject.property.name : '';
    var propValue = valueNode.property ? valueNode.property.name : '';

    if (propertyName.length) {
      propValue = propertyName + '.' + propValue;
    }

    if (subObjectType === 'ThisExpression') {
      propValue = 'this.' + propValue;
    }

    return propValue;
  }

  return {
    JSXAttribute: function(node) {
      if (!node.value || !node.value.expression || !node.value.expression.object) {
        return;
      }

      var propKey = typeof node.name === 'object' ? node.name.name : node.name;
      var propValue = rebuildPropValue(node.value.expression);

      var propIsEventHandler = PROP_EVENT_HANDLER_REGEX.test(propKey);
      var propFnIsNamedCorrectly = EVENT_HANDLER_REGEX.test(propValue);
      var eventName;

      if (propIsEventHandler && !propFnIsNamedCorrectly) {
        eventName = propKey.split(eventHandlerPropPrefix)[1];
        context.report(
          node,
          'Handler function for ' + propKey + ' prop key must be named ' + eventHandlerPrefix + eventName
        );
      } else if (propFnIsNamedCorrectly && !propIsEventHandler) {
        eventName = propValue.split(eventHandlerPrefix)[1];
        context.report(
          node,
          'Prop key for ' + propValue + ' must be named ' + eventHandlerPropPrefix + eventName
        );
      }
    }
  };

};

module.exports.schema = [{
  type: 'object',
  properties: {
    eventHandlerPrefix: {
      type: 'string'
    },
    eventHandlerPropPrefix: {
      type: 'string'
    }
  },
  additionalProperties: false
}];
