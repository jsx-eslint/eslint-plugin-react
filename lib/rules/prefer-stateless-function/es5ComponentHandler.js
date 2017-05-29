'use strict';

module.exports = function (sourceCode, componentNode) {
  function getES5BaseNode() {
    return componentNode.parent.parent;
  }
  /**
   * Returns name of the stateful component
   */
  function getComponentName() {
    return getES5BaseNode().id.name;
  }

  /**
   * Returns node of render definition
   * @returns {*}
   */
  function getRenderNode() {
    return componentNode.properties
      .find(function (member) {
        return member.type === 'Property' && member.key.name === 'render';
      });
  }

  /**
   * Returns every static property defined in the component
   * @returns {Array<string>} array of the properties
   */
  function getStaticProps() {
    function getProperties() {
      return componentNode.properties;
    }

    function getPropTypes() {
      return getProperties().find(function (property) {
        return property.key.name === 'propTypes';
      });
    }

    function getDefaultProps() {
      var defaultPropsNode = getProperties().find(function (property) {
        return property.key.name === 'getDefaultProps';
      }).body.body;
      var componentName = getComponentName();

      var bodyText = sourceCode.getText(defaultPropsNode);

      var returnNode =

    }

    function getPropertyCode(property) {
      return sourceCode.getText(property);
    }

    return [getPropTypes(), getDefaultProps()]
      .map(function (property) {
        var staticKeywordRegex = /static /g;
        var componentName = getComponentName();

        return getPropertyCode(property)
          .replace(staticKeywordRegex, componentName + '.');
      });
  }

  /**
   * Return body of the render function with curly braces
   * @returns {undefined|string}
   */
  function getRenderBody() {
    var renderNode = getRenderNode();

    if (!renderNode) {
      return '';
    }

    return sourceCode.getText(renderNode.value.body);
  }

  return {
    name: getComponentName(),
    body: getRenderBody(),
    staticProps: getStaticProps()
  };
};
