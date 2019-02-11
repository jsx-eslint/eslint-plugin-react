/**
 * @fileoverview Prevent usage of deprecated methods
 * @author Yannick Croissant
 * @author Scott Feeney
 * @author Sergei Startsev
 */
'use strict';

const has = require('has');

const Components = require('../util/Components');
const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');
const pragmaUtil = require('../util/pragma');
const versionUtil = require('../util/version');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const MODULES = {
  react: ['React'],
  'react-addons-perf': ['ReactPerf', 'Perf']
};

const DEPRECATED_MESSAGE = '{{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent usage of deprecated methods',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('no-deprecated')
    },
    schema: []
  },

  create: Components.detect((context, components, utils) => {
    const sourceCode = context.getSourceCode();
    const localName = pragmaUtil.getLocalNameFromContext(context);

    function getDeprecated() {
      const deprecated = {};
      // 0.12.0
      deprecated[`${localName}.renderComponent`] = ['0.12.0', `${localName}.render`];
      deprecated[`${localName}.renderComponentToString`] = ['0.12.0', `${localName}.renderToString`];
      deprecated[`${localName}.renderComponentToStaticMarkup`] = ['0.12.0', `${localName}.renderToStaticMarkup`];
      deprecated[`${localName}.isValidComponent`] = ['0.12.0', `${localName}.isValidElement`];
      deprecated[`${localName}.PropTypes.component`] = ['0.12.0', `${localName}.PropTypes.element`];
      deprecated[`${localName}.PropTypes.renderable`] = ['0.12.0', `${localName}.PropTypes.node`];
      deprecated[`${localName}.isValidClass`] = ['0.12.0'];
      deprecated['this.transferPropsTo'] = ['0.12.0', 'spread operator ({...})'];
      // 0.13.0
      deprecated[`${localName}.addons.classSet`] = ['0.13.0', 'the npm module classnames'];
      deprecated[`${localName}.addons.cloneWithProps`] = ['0.13.0', `${localName}.cloneElement`];
      // 0.14.0
      deprecated[`${localName}.render`] = ['0.14.0', 'ReactDOM.render'];
      deprecated[`${localName}.unmountComponentAtNode`] = ['0.14.0', 'ReactDOM.unmountComponentAtNode'];
      deprecated[`${localName}.findDOMNode`] = ['0.14.0', 'ReactDOM.findDOMNode'];
      deprecated[`${localName}.renderToString`] = ['0.14.0', 'ReactDOMServer.renderToString'];
      deprecated[`${localName}.renderToStaticMarkup`] = ['0.14.0', 'ReactDOMServer.renderToStaticMarkup'];
      // 15.0.0
      deprecated[`${localName}.addons.LinkedStateMixin`] = ['15.0.0'];
      deprecated['ReactPerf.printDOM'] = ['15.0.0', 'ReactPerf.printOperations'];
      deprecated['Perf.printDOM'] = ['15.0.0', 'Perf.printOperations'];
      deprecated['ReactPerf.getMeasurementsSummaryMap'] = ['15.0.0', 'ReactPerf.getWasted'];
      deprecated['Perf.getMeasurementsSummaryMap'] = ['15.0.0', 'Perf.getWasted'];
      // 15.5.0
      deprecated[`${localName}.createClass`] = ['15.5.0', 'the npm module create-react-class'];
      deprecated[`${localName}.addons.TestUtils`] = ['15.5.0', 'ReactDOM.TestUtils'];
      deprecated[`${localName}.PropTypes`] = ['15.5.0', 'the npm module prop-types'];
      // 15.6.0
      deprecated[`${localName}.DOM`] = ['15.6.0', 'the npm module react-dom-factories'];
      // 16.999.0
      // For now the following life-cycle methods are just legacy, not deprecated:
      // `componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate`
      // https://github.com/yannickcr/eslint-plugin-react/pull/1750#issuecomment-425975934
      deprecated.componentWillMount = [
        '16.999.0',
        'UNSAFE_componentWillMount',
        'https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. ' +
        'Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.'
      ];
      deprecated.componentWillReceiveProps = [
        '16.999.0',
        'UNSAFE_componentWillReceiveProps',
        'https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. ' +
        'Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.'
      ];
      deprecated.componentWillUpdate = [
        '16.999.0',
        'UNSAFE_componentWillUpdate',
        'https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. ' +
        'Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.'
      ];
      return deprecated;
    }

    function isDeprecated(method) {
      const deprecated = getDeprecated();

      return (
        deprecated &&
        deprecated[method] &&
        deprecated[method][0] &&
        versionUtil.testReactVersion(context, deprecated[method][0])
      );
    }

    function checkDeprecation(node, methodName, methodNode) {
      if (!isDeprecated(methodName)) {
        return;
      }
      const deprecated = getDeprecated();
      const version = deprecated[methodName][0];
      const newMethod = deprecated[methodName][1];
      const refs = deprecated[methodName][2];
      context.report({
        node: methodNode || node,
        message: DEPRECATED_MESSAGE,
        data: {
          oldMethod: methodName,
          version,
          newMethod: newMethod ? `, use ${newMethod} instead` : '',
          refs: refs ? `, see ${refs}` : ''
        }
      });
    }

    function getReactModuleName(node) {
      let moduleName = false;
      if (!node.init) {
        return moduleName;
      }
      for (const module in MODULES) {
        if (!has(MODULES, module)) {
          continue;
        }
        moduleName = MODULES[module].find(name => name === node.init.name);
        if (moduleName) {
          break;
        }
      }
      return moduleName;
    }

    /**
     * Returns life cycle methods if available
     * @param {ASTNode} node The AST node being checked.
     * @returns {Array} The array of methods.
     */
    function getLifeCycleMethods(node) {
      const properties = astUtil.getComponentProperties(node);
      return properties.map(property => ({
        name: astUtil.getPropertyName(property),
        node: astUtil.getPropertyNameNode(property)
      }));
    }

    /**
     * Checks life cycle methods
     * @param {ASTNode} node The AST node being checked.
     */
    function checkLifeCycleMethods(node) {
      if (utils.isES5Component(node) || utils.isES6Component(node)) {
        const methods = getLifeCycleMethods(node);
        methods.forEach(method => checkDeprecation(node, method.name, method.node));
      }
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      MemberExpression: function(node) {
        checkDeprecation(node, sourceCode.getText(node));
      },

      ImportDeclaration: function(node) {
        const isReactImport = typeof MODULES[node.source.value] !== 'undefined';
        if (!isReactImport) {
          return;
        }
        node.specifiers.forEach(specifier => {
          if (!specifier.imported) {
            return;
          }
          checkDeprecation(node, `${MODULES[node.source.value][0]}.${specifier.imported.name}`);
        });
      },

      VariableDeclarator: function(node) {
        const reactModuleName = getReactModuleName(node);
        const isRequire = node.init && node.init.callee && node.init.callee.name === 'require';
        const isReactRequire = node.init
          && node.init.arguments
          && node.init.arguments.length
          && typeof MODULES[node.init.arguments[0].value] !== 'undefined';
        const isDestructuring = node.id && node.id.type === 'ObjectPattern';

        if (
          !(isDestructuring && reactModuleName) &&
          !(isDestructuring && isRequire && isReactRequire)
        ) {
          return;
        }
        node.id.properties.forEach(property => {
          checkDeprecation(node, `${reactModuleName || localName}.${property.key.name}`);
        });
      },

      ClassDeclaration: checkLifeCycleMethods,
      ClassExpression: checkLifeCycleMethods,
      ObjectExpression: checkLifeCycleMethods
    };
  })
};
