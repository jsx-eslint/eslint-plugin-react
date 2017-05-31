'use strict';

const detectIndent = require('detect-indent');
const statefulComponentHandler = require('./statefulComponentHandler');

/**
 * Gets indentation style of the file
 * @param sourceCode
 * @returns {string} one indentation example
 */
function getFileIndentation(sourceCode) {
  return detectIndent(sourceCode.getText()).indent || '  ';
}

/**
 * Removes every usage of this in properties
 * Example: this.props -> props
 * @param str
 * @returns {string}
 */
function removeThisFromPropsUsages(str) {
  const thisRegex = /this\.props/g;

  return str.replace(thisRegex, 'props');
}

function ruleFixer(sourceCode, componentNode, utils) {
  /**
   * Returns string which is indented one level down
   * @param str
   * @returns {string}
   */
  function indentOneLevelDown(str) {
    const indentation = getFileIndentation(sourceCode);

    return str
      .split('\n')
      .map((line) => line.replace(indentation, ''))
      .join('\n');
  }

  /**
   * Return how deep whole block is indented
   * @param body {string} code block body
   * @returns {string} base indentation
   */
  function getBlockBaseIndentation(body) {
    const lines = body.split('\n');
    const lastLine = lines[lines.length - 1];
    const matchIndentation = /^(\s*)[^\s]/g;

    return matchIndentation.exec(lastLine)[1];
  }

  /**
   * Returns correctly indented static props of the component
   * @param staticProps {Array<string>}
   * @param transformedBody {string}
   * @returns {string}
   */
  function getStaticPropsText(staticProps, transformedBody) {
    const indentation = getBlockBaseIndentation(transformedBody);

    return staticProps
      .map((props) => indentation + indentOneLevelDown(props))
      .join('\n');
  }

  /**
   * Returns prepared body of the render function
   * @param body {string} body
   * @returns {string}
   */
  function transformBody(body) {
    if (!body) {
      return '{}';
    }

    return removeThisFromPropsUsages(indentOneLevelDown(body));
  }

  /**
   * Returns render of the stateless function
   * @param name {string} name of the component
   * @param transformedBody {string} body of the component with a curly braces
   * @returns {string} stateless component body
   */
  function getComponentText(name, transformedBody) {
    return `function ${name}(props) ${transformedBody}`;
  }

  /**
   * Returns concatenated values of the parts of component
   * @param options {object}
   * @param options.name {string} component name
   * @param options.body {string} render body with curly braces
   * @param options.staticProps {string[]} array of static properties attached to components
   * @returns {string}
   */
  function getComponent(options) {
    const transformedBody = transformBody(options.body);
    const componentText = getComponentText(options.name, transformedBody);
    const staticProps = getStaticPropsText(options.staticProps, transformedBody);

    if (staticProps) {
      return `${componentText}\n${staticProps}`;
    }

    return componentText;
  }

  return function (fixer) {
    if (utils.isES5Component(componentNode)) {
      return;
    }

    var componentDetails = statefulComponentHandler(sourceCode, componentNode);

    if (!componentDetails.name) {
      return;
    }

    // eslint-disable-next-line
    return fixer.replaceText(componentNode, getComponent(componentDetails));
  };
}

module.exports = ruleFixer;
