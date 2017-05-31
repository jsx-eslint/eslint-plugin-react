/**
 * @fileoverview Enforce stateless components to be written as a pure function
 * @author Yannick Croissant
 * @author Alberto Rodríguez
 * @copyright 2015 Alberto Rodríguez. All rights reserved.
 */

'use strict';

const detectIndent = require('detect-indent');
const values = require('object.values');
const Components = require('../util/Components');
const versionUtil = require('../util/version');
const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  componentShouldBePure: 'Component should be written as a pure function'
};

function statefulComponentHandler(sourceCode, componentNode) {
  /**
   * Returns name of the stateful component
   * @returns {string}
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
      .find((member) => member.type === 'MethodDefinition' && member.key.name === 'render');
  }

  function getProperties() {
    return componentNode.body.body.filter((property) => property.type === 'ClassProperty');
  }

  /**
   * Returns every static property defined in the component
   * @returns {Array<string>} array of the properties
   */
  function getStaticProps() {
    return getProperties().map((property) => {
      const staticKeywordRegex = /static /g;
      const componentName = getComponentName();

      return sourceCode.getText(property)
        .replace(staticKeywordRegex, `${componentName}.`);
    });
  }

  /**
   * Return body of the render function with curly braces
   * @returns {undefined|string}
   */
  function getRenderBody() {
    const renderNode = getRenderNode();

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
}

/**
 * Gets indentation style of the file
 * @param {object} sourceCode
 * @returns {string} one indentation example
 */
function getFileIndentation(sourceCode) {
  return detectIndent(sourceCode.getText()).indent || '  ';
}

/**
 * Removes every usage of this in properties
 * Example: this.props -> props
 * @param {string} str
 * @returns {string}
 */
function removeThisFromPropsUsages(str) {
  const thisRegex = /this\.props/g;

  return str.replace(thisRegex, 'props');
}

function ruleFixer(sourceCode, componentNode, utils) {
  /**
   * Returns string which is indented one level down
   * @param {string} str
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
   * @param {string} body code block body
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
   * @param {string[]} staticProps
   * @param {string} transformedBody
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
   * @param {string} body body
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
   * @param {string} name name of the component
   * @param {boolean} hasContext if the component accepts context
   * @param {string} transformedBody body of the component with a curly braces
   * @returns {string} stateless component body
   */
  function getComponentText(name, hasContext, transformedBody) {
    return `function ${name}(props${hasContext ? ', context' : ''}) ${transformedBody}`;
  }

  /**
   * Returns concatenated values of the parts of component
   * @param {object} options
   * @returns {string}
   */
  function getComponent(options) {
    const transformedBody = transformBody(options.body);
    const componentText = getComponentText(options.name, options.contextType, transformedBody);
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

    const componentDetails = statefulComponentHandler(sourceCode, componentNode);

    if (!componentDetails.name) {
      return;
    }

    // eslint-disable-next-line
    return fixer.replaceText(componentNode, getComponent(componentDetails));
  };
}

module.exports = {
  meta: {
    docs: {
      description: 'Enforce stateless components to be written as a pure function',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('prefer-stateless-function')
    },

    messages,

    fixable: 'code',

    schema: [{
      type: 'object',
      properties: {
        ignorePureComponents: {
          default: false,
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: Components.detect((context, components, utils) => {
    const configuration = context.options[0] || {};
    const ignorePureComponents = configuration.ignorePureComponents || false;

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    /**
     * Checks whether a given array of statements is a single call of `super`.
     * @see ESLint no-useless-constructor rule
     * @param {ASTNode[]} body - An array of statements to check.
     * @returns {boolean} `true` if the body is a single call of `super`.
     */
    function isSingleSuperCall(body) {
      return (
        body.length === 1
        && body[0].type === 'ExpressionStatement'
        && body[0].expression.type === 'CallExpression'
        && body[0].expression.callee.type === 'Super'
      );
    }

    /**
     * Checks whether a given node is a pattern which doesn't have any side effects.
     * Default parameters and Destructuring parameters can have side effects.
     * @see ESLint no-useless-constructor rule
     * @param {ASTNode} node - A pattern node.
     * @returns {boolean} `true` if the node doesn't have any side effects.
     */
    function isSimple(node) {
      return node.type === 'Identifier' || node.type === 'RestElement';
    }

    /**
     * Checks whether a given array of expressions is `...arguments` or not.
     * `super(...arguments)` passes all arguments through.
     * @see ESLint no-useless-constructor rule
     * @param {ASTNode[]} superArgs - An array of expressions to check.
     * @returns {boolean} `true` if the superArgs is `...arguments`.
     */
    function isSpreadArguments(superArgs) {
      return (
        superArgs.length === 1
        && superArgs[0].type === 'SpreadElement'
        && superArgs[0].argument.type === 'Identifier'
        && superArgs[0].argument.name === 'arguments'
      );
    }

    /**
     * Checks whether given 2 nodes are identifiers which have the same name or not.
     * @see ESLint no-useless-constructor rule
     * @param {ASTNode} ctorParam - A node to check.
     * @param {ASTNode} superArg - A node to check.
     * @returns {boolean} `true` if the nodes are identifiers which have the same
     *      name.
     */
    function isValidIdentifierPair(ctorParam, superArg) {
      return (
        ctorParam.type === 'Identifier'
        && superArg.type === 'Identifier'
        && ctorParam.name === superArg.name
      );
    }

    /**
     * Checks whether given 2 nodes are a rest/spread pair which has the same values.
     * @see ESLint no-useless-constructor rule
     * @param {ASTNode} ctorParam - A node to check.
     * @param {ASTNode} superArg - A node to check.
     * @returns {boolean} `true` if the nodes are a rest/spread pair which has the
     *      same values.
     */
    function isValidRestSpreadPair(ctorParam, superArg) {
      return (
        ctorParam.type === 'RestElement'
        && superArg.type === 'SpreadElement'
        && isValidIdentifierPair(ctorParam.argument, superArg.argument)
      );
    }

    /**
     * Checks whether given 2 nodes have the same value or not.
     * @see ESLint no-useless-constructor rule
     * @param {ASTNode} ctorParam - A node to check.
     * @param {ASTNode} superArg - A node to check.
     * @returns {boolean} `true` if the nodes have the same value or not.
     */
    function isValidPair(ctorParam, superArg) {
      return (
        isValidIdentifierPair(ctorParam, superArg)
        || isValidRestSpreadPair(ctorParam, superArg)
      );
    }

    /**
     * Checks whether the parameters of a constructor and the arguments of `super()`
     * have the same values or not.
     * @see ESLint no-useless-constructor rule
     * @param {ASTNode[]} ctorParams - The parameters of a constructor to check.
     * @param {ASTNode} superArgs - The arguments of `super()` to check.
     * @returns {boolean} `true` if those have the same values.
     */
    function isPassingThrough(ctorParams, superArgs) {
      if (ctorParams.length !== superArgs.length) {
        return false;
      }

      for (let i = 0; i < ctorParams.length; ++i) {
        if (!isValidPair(ctorParams[i], superArgs[i])) {
          return false;
        }
      }

      return true;
    }

    /**
     * Checks whether the constructor body is a redundant super call.
     * @see ESLint no-useless-constructor rule
     * @param {Array} body - constructor body content.
     * @param {Array} ctorParams - The params to check against super call.
     * @returns {boolean} true if the construtor body is redundant
     */
    function isRedundantSuperCall(body, ctorParams) {
      return (
        isSingleSuperCall(body)
        && ctorParams.every(isSimple)
        && (
          isSpreadArguments(body[0].expression.arguments)
          || isPassingThrough(ctorParams, body[0].expression.arguments)
        )
      );
    }

    /**
     * Check if a given AST node have any other properties the ones available in stateless components
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if the node has at least one other property, false if not.
     */
    function hasOtherProperties(node) {
      const properties = astUtil.getComponentProperties(node);
      return properties.some((property) => {
        const name = astUtil.getPropertyName(property);
        const isDisplayName = name === 'displayName';
        const isPropTypes = name === 'propTypes' || ((name === 'props') && property.typeAnnotation);
        const contextTypes = name === 'contextTypes';
        const defaultProps = name === 'defaultProps';
        const isUselessConstructor = property.kind === 'constructor'
          && !!property.value.body
          && isRedundantSuperCall(property.value.body.body, property.value.params);
        const isRender = name === 'render';
        const isStatic = property.static;
        return !isDisplayName
          && !isPropTypes
          && !contextTypes
          && !defaultProps
          && !isUselessConstructor
          && !isRender
          && !isStatic;
      });
    }

    /**
     * Mark component as pure as declared
     * @param {ASTNode} node The AST node being checked.
     */
    function markSCUAsDeclared(node) {
      components.set(node, {
        hasSCU: true
      });
    }

    /**
     * Mark childContextTypes as declared
     * @param {ASTNode} node The AST node being checked.
     */
    function markChildContextTypesAsDeclared(node) {
      components.set(node, {
        hasChildContextTypes: true
      });
    }

    /**
     * Mark a setState as used
     * @param {ASTNode} node The AST node being checked.
     */
    function markThisAsUsed(node) {
      components.set(node, {
        useThis: true
      });
    }

    /**
     * Mark a props or context as used
     * @param {ASTNode} node The AST node being checked.
     */
    function markPropsOrContextAsUsed(node) {
      components.set(node, {
        usePropsOrContext: true
      });
    }

    /**
     * Mark a ref as used
     * @param {ASTNode} node The AST node being checked.
     */
    function markRefAsUsed(node) {
      components.set(node, {
        useRef: true
      });
    }

    /**
     * Mark return as invalid
     * @param {ASTNode} node The AST node being checked.
     */
    function markReturnAsInvalid(node) {
      components.set(node, {
        invalidReturn: true
      });
    }

    /**
     * Mark a ClassDeclaration as having used decorators
     * @param {ASTNode} node The AST node being checked.
     */
    function markDecoratorsAsUsed(node) {
      components.set(node, {
        useDecorators: true
      });
    }

    function visitClass(node) {
      if (ignorePureComponents && utils.isPureComponent(node)) {
        markSCUAsDeclared(node);
      }

      if (node.decorators && node.decorators.length) {
        markDecoratorsAsUsed(node);
      }
    }

    return {
      ClassDeclaration: visitClass,
      ClassExpression: visitClass,

      // Mark `this` destructuring as a usage of `this`
      VariableDeclarator(node) {
        // Ignore destructuring on other than `this`
        if (!node.id || node.id.type !== 'ObjectPattern' || !node.init || node.init.type !== 'ThisExpression') {
          return;
        }
        // Ignore `props` and `context`
        const useThis = node.id.properties.some((property) => {
          const name = astUtil.getPropertyName(property);
          return name !== 'props' && name !== 'context';
        });
        if (!useThis) {
          markPropsOrContextAsUsed(node);
          return;
        }
        markThisAsUsed(node);
      },

      // Mark `this` usage
      MemberExpression(node) {
        if (node.object.type !== 'ThisExpression') {
          if (node.property && node.property.name === 'childContextTypes') {
            const component = utils.getRelatedComponent(node);
            if (!component) {
              return;
            }
            markChildContextTypesAsDeclared(component.node);
          }
          return;
        // Ignore calls to `this.props` and `this.context`
        }
        if (
          (node.property.name || node.property.value) === 'props'
          || (node.property.name || node.property.value) === 'context'
        ) {
          markPropsOrContextAsUsed(node);
          return;
        }
        markThisAsUsed(node);
      },

      // Mark `ref` usage
      JSXAttribute(node) {
        const name = context.getSourceCode().getText(node.name);
        if (name !== 'ref') {
          return;
        }
        markRefAsUsed(node);
      },

      // Mark `render` that do not return some JSX
      ReturnStatement(node) {
        let blockNode;
        let scope = context.getScope();
        while (scope) {
          blockNode = scope.block && scope.block.parent;
          if (blockNode && (blockNode.type === 'MethodDefinition' || blockNode.type === 'Property')) {
            break;
          }
          scope = scope.upper;
        }
        const isRender = blockNode && blockNode.key && blockNode.key.name === 'render';
        const allowNull = versionUtil.testReactVersion(context, '15.0.0'); // Stateless components can return null since React 15
        const isReturningJSX = utils.isReturningJSX(node, !allowNull);
        const isReturningNull = node.argument && (node.argument.value === null || node.argument.value === false);
        if (
          !isRender
          || (allowNull && (isReturningJSX || isReturningNull))
          || (!allowNull && isReturningJSX)
        ) {
          return;
        }
        markReturnAsInvalid(node);
      },

      'Program:exit'() {
        const list = components.list();
        values(list).forEach((component) => {
          const {node, ...rest} = component;
          if (
            hasOtherProperties(node)
            || component.useThis
            || component.useRef
            || component.invalidReturn
            || component.hasChildContextTypes
            || component.useDecorators
            || (!utils.isES5Component(node) && !utils.isES6Component(node))
          ) {
            return;
          }

          if (component.hasSCU) {
            return;
          }
          report(context, messages.componentShouldBePure, 'componentShouldBePure', {
            node,
            fix: ruleFixer(context.getSourceCode(), node, utils)
          });
        });
      }
    };
  })
};
