'use strict';

module.exports = function (sourceCode, componentNode) {
  /**
   * Returns name of the stateful component
   */
  function getComponentName() {
    return (componentNode.id && componentNode.id.name) || '';
  }

  /**
   * Returns node of render definition
   * @returns {*}
   */
  function getRenderNode() {
    return componentNode.body.body
      .find(function (member) {
        return member.type === 'MethodDefinition' && member.key.name === 'render';
      });
  }

  /**
   * Returns every static property defined in the component
   * @returns {Array<string>} array of the properties
   */
  function getStaticProps() {
    function getProperties() {
      return componentNode.body.body
        .filter(function (property) {
          return property.type === 'ClassProperty';
        });
    }

    function getPropertyCode(property) {
      return sourceCode.getText(property);
    }

    return getProperties()
      .map(function (property) {
        var staticKeywordRegex = /static /g;
        var componentName = getComponentName();

        return getPropertyCode(property)
          .replace(staticKeywordRegex, `${componentName}.`);
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
