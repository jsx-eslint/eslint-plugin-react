/**
 * @fileoverview Prevent missing props validation in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// As for exceptions for props.children or props.className (and alike) look at
// https://github.com/yannickcr/eslint-plugin-react/issues/7

const has = require('has');
const Components = require('../util/Components');
const variable = require('../util/variable');
const annotations = require('../util/annotations');
const versionUtil = require('../util/version');
const propsUtil = require('../util/props');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const PROPS_REGEX = /^(props|nextProps)$/;
const DIRECT_PROPS_REGEX = /^(props|nextProps)\s*(\.|\[)/;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent missing props validation in a React component definition',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('prop-types')
    },

    schema: [{
      type: 'object',
      properties: {
        ignore: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        customValidators: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        skipUndeclared: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: Components.detect((context, components, utils) => {
    const sourceCode = context.getSourceCode();
    const configuration = context.options[0] || {};
    const propWrapperFunctions = new Set(context.settings.propWrapperFunctions || []);
    const ignored = configuration.ignore || [];
    const customValidators = configuration.customValidators || [];
    const skipUndeclared = configuration.skipUndeclared || false;
    // Used to track the type annotations in scope.
    // Necessary because babel's scopes do not track type annotations.
    let stack = null;
    const classExpressions = [];

    const MISSING_MESSAGE = '\'{{name}}\' is missing in props validation';

    /**
     * Helper for accessing the current scope in the stack.
     * @param {string} key The name of the identifier to access. If omitted, returns the full scope.
     * @param {ASTNode} value If provided sets the new value for the identifier.
     * @returns {Object|ASTNode} Either the whole scope or the ASTNode associated with the given identifier.
     */
    function typeScope(key, value) {
      if (arguments.length === 0) {
        return stack[stack.length - 1];
      } else if (arguments.length === 1) {
        return stack[stack.length - 1][key];
      }
      stack[stack.length - 1][key] = value;
      return value;
    }

    /**
     * Check if we are in a class constructor
     * @return {boolean} true if we are in a class constructor, false if not
     */
    function inConstructor() {
      let scope = context.getScope();
      while (scope) {
        if (scope.block && scope.block.parent && scope.block.parent.kind === 'constructor') {
          return true;
        }
        scope = scope.upper;
      }
      return false;
    }

    /**
     * Check if we are in a class constructor
     * @return {boolean} true if we are in a class constructor, false if not
     */
    function inComponentWillReceiveProps() {
      let scope = context.getScope();
      while (scope) {
        if (
          scope.block && scope.block.parent &&
          scope.block.parent.key && scope.block.parent.key.name === 'componentWillReceiveProps'
        ) {
          return true;
        }
        scope = scope.upper;
      }
      return false;
    }

    /**
    * Checks if a prop is being assigned a value props.bar = 'bar'
    * @param {ASTNode} node The AST node being checked.
    * @returns {Boolean}
    */

    function isAssignmentToProp(node) {
      return (
        node.parent &&
        node.parent.type === 'AssignmentExpression' &&
        node.parent.left === node
      );
    }

    /**
     * Checks if we are using a prop
     * @param {ASTNode} node The MemberExpression node being checked.
     * @returns {Boolean} True if we are using a prop, false if not.
     */
    function isPropTypesUsage(node) {
      // only return usages for the MemberExpressions at the bottom of the tree
      if (node.object.type !== 'Identifier' && node.object.type !== 'ThisExpression') {
        return false;
      }

      const isInClassComponent = !!(utils.getParentES6Component() || utils.getParentES5Component())
        && node.object.name !== 'React';


      const isDirectProp = DIRECT_PROPS_REGEX.test(sourceCode.getText(node));
      const isThisPropsUsage = node.object.type === 'ThisExpression' && node.property.name === 'props';
      const isPropsUsage = node.object.name === 'props';
      const isInStatelessComponent = !!utils.getParentStatelessComponent() && !isInClassComponent;

      if (isPropsUsage && !isInClassComponent && !isAssignmentToProp(node)) {
        return true;
      }

      // props.foo usages are only allowed
      // in the constructor and componentWillReceiveProps in class components
      if (isInClassComponent && !inConstructor() && !inComponentWillReceiveProps() && isDirectProp) {
        return false;
      }

      if (isInStatelessComponent) {
        if (isAssignmentToProp(node)) {
          return false;
        }
        // don't allow this.props usage in functional components
        if (isThisPropsUsage) {
          return false;
        }
      }

      if (!isInStatelessComponent && !isInClassComponent) {
        return false;
      }

      return true;
    }

    /**
     * Checks if we are declaring a `props` class property with a flow type annotation.
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if the node is a type annotated props declaration, false if not.
     */
    function isAnnotatedClassPropsDeclaration(node) {
      if (node && node.type === 'ClassProperty') {
        const tokens = context.getFirstTokens(node, 2);
        if (
          node.typeAnnotation && (
            tokens[0].value === 'props' ||
            (tokens[1] && tokens[1].value === 'props')
          )
        ) {
          return true;
        }
      }
      return false;
    }

    /**
     * Checks if we are declaring a props as a generic type in a flow-annotated class.
     *
     * @param {ASTNode} node  the AST node being checked.
     * @returns {Boolean} True if the node is a class with generic prop types, false if not.
     */
    function isSuperTypeParameterPropsDeclaration(node) {
      if (node && (node.type === 'ClassDeclaration' || node.type === 'ClassExpression')) {
        if (node.superTypeParameters && node.superTypeParameters.params.length > 0) {
          return true;
        }
      }
      return false;
    }

    /**
     * Checks if the prop is ignored
     * @param {String} name Name of the prop to check.
     * @returns {Boolean} True if the prop is ignored, false if not.
     */
    function isIgnored(name) {
      return ignored.indexOf(name) !== -1;
    }

    /**
     * Checks if prop should be validated by plugin-react-proptypes
     * @param {String} validator Name of validator to check.
     * @returns {Boolean} True if validator should be checked by custom validator.
     */
    function hasCustomValidator(validator) {
      return customValidators.indexOf(validator) !== -1;
    }

    /**
     * Checks if the component must be validated
     * @param {Object} component The component to process
     * @returns {Boolean} True if the component must be validated, false if not.
     */
    function mustBeValidated(component) {
      const isSkippedByConfig = skipUndeclared && typeof component.declaredPropTypes === 'undefined';
      return Boolean(
        component &&
        component.usedPropTypes &&
        !component.ignorePropsValidation &&
        !isSkippedByConfig
      );
    }

    /**
     * Internal: Checks if the prop is declared
     * @param {Object} declaredPropTypes Description of propTypes declared in the current component
     * @param {String[]} keyList Dot separated name of the prop to check.
     * @returns {Boolean} True if the prop is declared, false if not.
     */
    function _isDeclaredInComponent(declaredPropTypes, keyList) {
      for (let i = 0, j = keyList.length; i < j; i++) {
        const key = keyList[i];

        const propType = (
          declaredPropTypes && (
            // Check if this key is declared
            (declaredPropTypes[key] || // If not, check if this type accepts any key
            declaredPropTypes.__ANY_KEY__)
          )
        );

        if (!propType) {
          // If it's a computed property, we can't make any further analysis, but is valid
          return key === '__COMPUTED_PROP__';
        }
        if (typeof propType === 'object' && Object.keys(propType).length === 0) {
          return true;
        }

        // Consider every children as declared
        if (propType.children === true) {
          return true;
        }
        if (propType.acceptedProperties) {
          return key in propType.acceptedProperties;
        }
        if (propType.type === 'union') {
          // If we fall in this case, we know there is at least one complex type in the union
          if (i + 1 >= j) {
            // this is the last key, accept everything
            return true;
          }
          // non trivial, check all of them
          const unionTypes = propType.children;
          const unionPropType = {};
          for (let k = 0, z = unionTypes.length; k < z; k++) {
            unionPropType[key] = unionTypes[k];
            const isValid = _isDeclaredInComponent(
              unionPropType,
              keyList.slice(i)
            );
            if (isValid) {
              return true;
            }
          }

          // every possible union were invalid
          return false;
        }
        declaredPropTypes = propType.children;
      }
      return true;
    }

    /**
     * Checks if the prop is declared
     * @param {ASTNode} node The AST node being checked.
     * @param {String[]} names List of names of the prop to check.
     * @returns {Boolean} True if the prop is declared, false if not.
     */
    function isDeclaredInComponent(node, names) {
      while (node) {
        const component = components.get(node);

        const isDeclared =
          component && component.confidence === 2 &&
          _isDeclaredInComponent(component.declaredPropTypes || {}, names)
        ;
        if (isDeclared) {
          return true;
        }
        node = node.parent;
      }
      return false;
    }

    /**
     * Checks if the prop has spread operator.
     * @param {ASTNode} node The AST node being marked.
     * @returns {Boolean} True if the prop has spread operator, false if not.
     */
    function hasSpreadOperator(node) {
      const tokens = sourceCode.getTokens(node);
      return tokens.length && tokens[0].value === '...';
    }

    /**
     * Removes quotes from around an identifier.
     * @param {string} the identifier to strip
     */
    function stripQuotes(string) {
      return string.replace(/^\'|\'$/g, '');
    }

    /**
     * Retrieve the name of a key node
     * @param {ASTNode} node The AST node with the key.
     * @return {string} the name of the key
     */
    function getKeyValue(node) {
      if (node.type === 'ObjectTypeProperty') {
        const tokens = context.getFirstTokens(node, 2);
        return (tokens[0].value === '+' || tokens[0].value === '-'
          ? tokens[1].value
          : stripQuotes(tokens[0].value)
        );
      }
      const key = node.key || node.argument;
      return key.type === 'Identifier' ? key.name : key.value;
    }

    /**
     * Iterates through a properties node, like a customized forEach.
     * @param {Object[]} properties Array of properties to iterate.
     * @param {Function} fn Function to call on each property, receives property key
        and property value. (key, value) => void
     */
    function iterateProperties(properties, fn) {
      if (properties.length && typeof fn === 'function') {
        for (let i = 0, j = properties.length; i < j; i++) {
          const node = properties[i];
          const key = getKeyValue(node);

          const value = node.value;
          fn(key, value, node);
        }
      }
    }

    /**
     * Traverse down the tree of properties in a node, build up an array of keys
     * and call a function
     * @param {Object[]} properties Array of properties to traverse.
     * @param {Function} fn Function to call on each property, receives property key, property value
     * property node and all keys above this node in the tree
     * (key, value, property, keys) => void
     */
    function traverseProperties(properties, fn, keys) {
      keys = keys || [];
      iterateProperties(properties, (key, value, property) => {
        const updatedKeys = keys.concat(key);
        fn(key, value, property, updatedKeys);
        if (value && value.properties) {
          traverseProperties(value.properties, fn, updatedKeys);
        }
      });
    }

    /**
     * Creates the representation of the React propTypes for the component.
     * The representation is used to verify nested used properties.
     * @param {ASTNode} value Node of the PropTypes for the desired property
     * @return {Object} The representation of the declaration, empty object means
     *    the property is declared without the need for further analysis.
     */
    function buildReactDeclarationTypes(value) {
      if (
        value &&
        value.callee &&
        value.callee.object &&
        hasCustomValidator(value.callee.object.name)
      ) {
        return {};
      }

      if (
        value &&
        value.type === 'MemberExpression' &&
        value.property &&
        value.property.name &&
        value.property.name === 'isRequired'
      ) {
        value = value.object;
      }

      // Verify PropTypes that are functions
      if (
        value &&
        value.type === 'CallExpression' &&
        value.callee &&
        value.callee.property &&
        value.callee.property.name &&
        value.arguments &&
        value.arguments.length > 0
      ) {
        const callName = value.callee.property.name;
        const argument = value.arguments[0];
        switch (callName) {
          case 'shape':
            if (argument.type !== 'ObjectExpression') {
              // Invalid proptype or cannot analyse statically
              return {};
            }
            const shapeTypeDefinition = {
              type: 'shape',
              children: {}
            };
            iterateProperties(argument.properties, (childKey, childValue) => {
              shapeTypeDefinition.children[childKey] = buildReactDeclarationTypes(childValue);
            });
            return shapeTypeDefinition;
          case 'arrayOf':
          case 'objectOf':
            return {
              type: 'object',
              children: {
                __ANY_KEY__: buildReactDeclarationTypes(argument)
              }
            };
          case 'oneOfType':
            if (
              !argument.elements ||
              !argument.elements.length
            ) {
              // Invalid proptype or cannot analyse statically
              return {};
            }
            const unionTypeDefinition = {
              type: 'union',
              children: []
            };
            for (let i = 0, j = argument.elements.length; i < j; i++) {
              const type = buildReactDeclarationTypes(argument.elements[i]);
              // keep only complex type
              if (Object.keys(type).length > 0) {
                if (type.children === true) {
                  // every child is accepted for one type, abort type analysis
                  unionTypeDefinition.children = true;
                  return unionTypeDefinition;
                }
              }

              unionTypeDefinition.children.push(type);
            }
            if (unionTypeDefinition.length === 0) {
              // no complex type found, simply accept everything
              return {};
            }
            return unionTypeDefinition;
          case 'instanceOf':
            return {
              type: 'instance',
              // Accept all children because we can't know what type they are
              children: true
            };
          case 'oneOf':
          default:
            return {};
        }
      }
      // Unknown property or accepts everything (any, object, ...)
      return {};
    }

    /**
     * Creates the representation of the React props type annotation for the component.
     * The representation is used to verify nested used properties.
     * @param {ASTNode} annotation Type annotation for the props class property.
     * @return {Object} The representation of the declaration, empty object means
     *    the property is declared without the need for further analysis.
     */
    function buildTypeAnnotationDeclarationTypes(annotation, seen) {
      if (typeof seen === 'undefined') {
        // Keeps track of annotations we've already seen to
        // prevent problems with recursive types.
        seen = new Set();
      }
      if (seen.has(annotation)) {
        // This must be a recursive type annotation, so just accept anything.
        return {};
      }
      seen.add(annotation);

      switch (annotation.type) {
        case 'GenericTypeAnnotation':
          if (typeScope(annotation.id.name)) {
            return buildTypeAnnotationDeclarationTypes(typeScope(annotation.id.name), seen);
          }
          return {};
        case 'ObjectTypeAnnotation':
          let containsObjectTypeSpread = false;
          const shapeTypeDefinition = {
            type: 'shape',
            children: {}
          };
          iterateProperties(annotation.properties, (childKey, childValue) => {
            if (!childKey && !childValue) {
              containsObjectTypeSpread = true;
            } else {
              shapeTypeDefinition.children[childKey] = buildTypeAnnotationDeclarationTypes(childValue, seen);
            }
          });

          // nested object type spread means we need to ignore/accept everything in this object
          if (containsObjectTypeSpread) {
            return {};
          }
          return shapeTypeDefinition;
        case 'UnionTypeAnnotation':
          const unionTypeDefinition = {
            type: 'union',
            children: []
          };
          for (let i = 0, j = annotation.types.length; i < j; i++) {
            const type = buildTypeAnnotationDeclarationTypes(annotation.types[i], seen);
            // keep only complex type
            if (Object.keys(type).length > 0) {
              if (type.children === true) {
                // every child is accepted for one type, abort type analysis
                unionTypeDefinition.children = true;
                return unionTypeDefinition;
              }
            }

            unionTypeDefinition.children.push(type);
          }
          if (unionTypeDefinition.children.length === 0) {
            // no complex type found, simply accept everything
            return {};
          }
          return unionTypeDefinition;
        case 'ArrayTypeAnnotation':
          return {
            type: 'object',
            children: {
              __ANY_KEY__: buildTypeAnnotationDeclarationTypes(annotation.elementType, seen)
            }
          };
        default:
          // Unknown or accepts everything.
          return {};
      }
    }

    /**
     * Retrieve the name of a property node
     * @param {ASTNode} node The AST node with the property.
     * @return {string} the name of the property or undefined if not found
     */
    function getPropertyName(node) {
      const property = node.property;
      if (property) {
        switch (property.type) {
          case 'Identifier':
            if (node.computed) {
              return '__COMPUTED_PROP__';
            }
            return property.name;
          case 'MemberExpression':
            return void 0;
          case 'Literal':
            // Accept computed properties that are literal strings
            if (typeof property.value === 'string') {
              return property.value;
            }
            // falls through
          default:
            if (node.computed) {
              return '__COMPUTED_PROP__';
            }
            break;
        }
      }
      return void 0;
    }

    /**
     * Mark prop type usages in an array of properties
     * @param {ASTNode} properties An array of properties to search.
     * @param {Object} usedPropTypes An array of previous prop type usages.
     * @param {Object} allNames any names that come from parent prop type usages.
     */
    function markPropTypesInProperties(properties, usedPropTypes, allNames) {
      allNames = allNames || [];
      traverseProperties(properties, (key, value, property, allPropertyNames) => {
        if (hasSpreadOperator(property) || property.computed) {
          return;
        }
        const propName = getKeyValue(property);
        const propValueName = property.value.name;
        const isRenamedProperty = propName !== propValueName && property.value.type === 'Identifier';
        if (propName) {
          usedPropTypes.push({
            name: isRenamedProperty ? propValueName : propName,
            allNames: allNames.concat(allPropertyNames),
            node: property
          });
        }
      });
    }

    /**
     * traverse up a member expression and a call a callback
     * @param {ASTNode} expression a member expression node.
     * @param {Function} fn Function to call on each expression, receives property name,
     * the from steps further down the tree, and the expression
     * (propertyName, parentNames, expression) => void
     * @param {ASTNode} parentNames the names from steps further down the tree.
     */
    function traverseMemberExpression(expression, fn, parentNames) {
      parentNames = parentNames || [];
      const propertyName = getPropertyName(expression);
      if (propertyName) {
        const childNames = parentNames.concat(propertyName);
        fn(propertyName, childNames, expression);
        if (expression.parent.type === 'MemberExpression') {
          return traverseMemberExpression(expression.parent, fn, childNames);
        }
      }
      return parentNames;
    }

    /**
     * Checks if the node is using destructuring
     * @param {ASTNode} node a VariableDeclarator node.
     * @returns {Boolean} True if destructing, false if not.
     */
    function isDestructuredVariableDeclaration(node) {
      return node.init && node.id && node.id.type === 'ObjectPattern';
    }

    /**
     * Check if the nodes parent is using destructuring
     * @param {ASTNode} node any node.
     * @returns {Boolean} True if destructing, false if not.
     */
    function parentIsDestructured(node) {
      return node.parent.type === 'VariableDeclarator' && isDestructuredVariableDeclaration(node.parent);
    }


    /**
     * Handle all of the variations of MemberExpression nodes (props, vs this.props etc)
     * and return the starting node and parent usage if needed
     * @param {ASTNode} node a MemberExpression node.
     * @param {ASTNode} usedPropTypes an array of previous prop type usages.
     * @returns {Object} An object containing the startingNode MemberExpression to traverse
     * and the parentUsage if one exists, or returns void if its not a valid node
     */
    function getProcessedMemberExpression(node, usedPropTypes) {
      const isThisProps = (node.object.type === 'ThisExpression' && node.property.name === 'props');
      // if this is the top MemberExpression node
      if (isThisProps && node.parent.type !== 'MemberExpression') {
        if (!parentIsDestructured(node)) {
          return void 0;
        }

        // if the parent is using destructuring, mark prop types for its properties
        const properties = node.parent.id.properties;
        markPropTypesInProperties(properties, usedPropTypes);
        return void 0;
      }

      // this.props vs props
      const startingNode = isThisProps ? node.parent : node;
      const directlyOffOfProps = startingNode.object &&
        (startingNode.object.name === 'props' || startingNode.object.name === 'nextProps');

      // if this member expression isn't coming off props in some way
      // don't search for a parent usage
      if (directlyOffOfProps || isThisProps) {
        return {
          startingNode: startingNode,
          parentUsage: void 0
        };
      }

      // let { a } = this.props
      // <div>{a.b}</div>
      const parentUsage = usedPropTypes.find(
        propType => propType.name === node.object.name
      );

      // if we're not directly off of props
      // and there isn't a parent usage, skip this node
      if (!parentUsage) {
        return void 0;
      }
      return {
        startingNode: startingNode,
        parentUsage: parentUsage
      };
    }

    /**
     * Mark a node as using a prop type
     * @param {ASTNode} node The AST node being marked.
     */
    function markPropTypesAsUsed(node) {
      const component = components.get(utils.getParentComponent());
      const usedPropTypes = (component && component.usedPropTypes || []).slice();
      switch (node.type) {
        case 'MemberExpression':
          const processedExpression = getProcessedMemberExpression(node, usedPropTypes);
          if (!processedExpression) {
            break;
          }
          const startingNames = processedExpression.parentUsage ? processedExpression.parentUsage.allNames : [];
          traverseMemberExpression(processedExpression.startingNode, (propertyName, currentNames, currentNode) => {
            if (propertyName === '__COMPUTED_PROP__') {
              return;
            }

            // Ignore Object methods
            if (Object.prototype[propertyName] && typeof Object.prototype[propertyName] === 'function') {
              return;
            }

            // Ignore Array methods
            if (Array.prototype[propertyName] && typeof Array.prototype[propertyName] === 'function') {
              return;
            }

            usedPropTypes.push({
              name: propertyName,
              allNames: currentNames,
              node: currentNode.property
            });
            if (parentIsDestructured(currentNode)) {
              markPropTypesInProperties(currentNode.parent.id.properties, usedPropTypes, currentNames);
            }
          }, startingNames);
          break;
        case 'ArrowFunctionExpression':
        case 'FunctionDeclaration':
        case 'FunctionExpression':
          markPropTypesInProperties(node.params[0].properties, usedPropTypes);
          break;
        case 'MethodDefinition':
          const destructuring = node.value && node.value.params && node.value.params[0] && node.value.params[0].type === 'ObjectPattern';
          if (destructuring) {
            type = 'destructuring';
            properties = node.value.params[0].properties;
            break;
          } else {
            return;
          }
        case 'VariableDeclarator':
          const isInClassComponent = (utils.getParentES6Component() || utils.getParentES5Component());
          const isInStatelessComponent = !!utils.getParentStatelessComponent() & !isInClassComponent;

          // // let {firstname} = props
          const directDestructuring =
            PROPS_REGEX.test(node.init.name) &&
            (isInStatelessComponent || inConstructor() || inComponentWillReceiveProps());

          for (let i = 0, j = node.id.properties.length; i < j; i++) {
            // let {props: {firstname}} = this
            const thisDestructuring = (
              !hasSpreadOperator(node.id.properties[i]) &&
              (PROPS_REGEX.test(node.id.properties[i].key.name) || PROPS_REGEX.test(node.id.properties[i].key.value)) &&
              node.id.properties[i].value.type === 'ObjectPattern'
            );

            const properties = thisDestructuring ? node.id.properties[i].value.properties : node.id.properties;
            let allNames = [];
            if (!thisDestructuring && !directDestructuring) {
              // let {props: { a }}
              // let { b } = a
              const parentUsage = usedPropTypes.find(
                propType => propType.name === node.init.name
              );
              if (!parentUsage) {
                continue;
              }
              if (parentUsage) {
                allNames = parentUsage.allNames;
              }
            }
            markPropTypesInProperties(properties, usedPropTypes, allNames);
            break;
          }
          break;
        default:
          throw new Error(`${node.type} ASTNodes are not handled by markPropTypesAsUsed`);
      }

      components.set(node, {
        usedPropTypes: usedPropTypes
      });
    }


    /**
     * Marks all props found inside ObjectTypeAnnotaiton as declared.
     *
     * Modifies the declaredProperties object
     * @param {ASTNode} propTypes
     * @param {Object} declaredPropTypes
     * @returns {Boolean} True if propTypes should be ignored (e.g. when a type can't be resolved, when it is imported)
     */
    function declarePropTypesForObjectTypeAnnotation(propTypes, declaredPropTypes) {
      let ignorePropsValidation = false;

      iterateProperties(propTypes.properties, (key, value) => {
        if (!value) {
          ignorePropsValidation = true;
          return;
        }

        declaredPropTypes[key] = buildTypeAnnotationDeclarationTypes(value);
      });

      return ignorePropsValidation;
    }

    /**
     * Marks all props found inside IntersectionTypeAnnotation as declared.
     * Since InterSectionTypeAnnotations can be nested, this handles recursively.
     *
     * Modifies the declaredPropTypes object
     * @param {ASTNode} propTypes
     * @param {Object} declaredPropTypes
     * @returns {Boolean} True if propTypes should be ignored (e.g. when a type can't be resolved, when it is imported)
     */
    function declarePropTypesForIntersectionTypeAnnotation(propTypes, declaredPropTypes) {
      return propTypes.types.some(annotation => {
        if (annotation.type === 'ObjectTypeAnnotation') {
          return declarePropTypesForObjectTypeAnnotation(annotation, declaredPropTypes);
        }

        if (annotation.type === 'UnionTypeAnnotation') {
          return true;
        }

        const typeNode = typeScope(annotation.id.name);

        if (!typeNode) {
          return true;
        } else if (typeNode.type === 'IntersectionTypeAnnotation') {
          return declarePropTypesForIntersectionTypeAnnotation(typeNode, declaredPropTypes);
        }

        return declarePropTypesForObjectTypeAnnotation(typeNode, declaredPropTypes);
      });
    }

    /**
     * Mark a prop type as declared
     * @param {ASTNode} node The AST node being checked.
     * @param {propTypes} node The AST node containing the proptypes
     */
    function markPropTypesAsDeclared(node, propTypes) {
      let componentNode = node;
      while (componentNode && !components.get(componentNode)) {
        componentNode = componentNode.parent;
      }
      const component = components.get(componentNode);
      const declaredPropTypes = component && component.declaredPropTypes || {};
      let ignorePropsValidation = false;

      switch (propTypes && propTypes.type) {
        case 'ObjectTypeAnnotation':
          ignorePropsValidation = declarePropTypesForObjectTypeAnnotation(propTypes, declaredPropTypes);
          break;
        case 'ObjectExpression':
          iterateProperties(propTypes.properties, (key, value) => {
            if (!value) {
              ignorePropsValidation = true;
              return;
            }
            declaredPropTypes[key] = buildReactDeclarationTypes(value);
          });
          break;
        case 'MemberExpression':
          let curDeclaredPropTypes = declaredPropTypes;
          // Walk the list of properties, until we reach the assignment
          // ie: ClassX.propTypes.a.b.c = ...
          while (
            propTypes &&
            propTypes.parent &&
            propTypes.parent.type !== 'AssignmentExpression' &&
            propTypes.property &&
            curDeclaredPropTypes
          ) {
            const propName = propTypes.property.name;
            if (propName in curDeclaredPropTypes) {
              curDeclaredPropTypes = curDeclaredPropTypes[propName].children;
              propTypes = propTypes.parent;
            } else {
              // This will crash at runtime because we haven't seen this key before
              // stop this and do not declare it
              propTypes = null;
            }
          }
          if (propTypes && propTypes.parent && propTypes.property) {
            curDeclaredPropTypes[propTypes.property.name] =
              buildReactDeclarationTypes(propTypes.parent.right);
          } else {
            ignorePropsValidation = true;
          }
          break;
        case 'Identifier':
          const variablesInScope = variable.variablesInScope(context);
          for (let i = 0, j = variablesInScope.length; i < j; i++) {
            if (variablesInScope[i].name !== propTypes.name) {
              continue;
            }
            const defInScope = variablesInScope[i].defs[variablesInScope[i].defs.length - 1];
            markPropTypesAsDeclared(node, defInScope.node && defInScope.node.init);
            return;
          }
          ignorePropsValidation = true;
          break;
        case 'CallExpression':
          if (
            propWrapperFunctions.has(sourceCode.getText(propTypes.callee)) &&
            propTypes.arguments && propTypes.arguments[0]
          ) {
            markPropTypesAsDeclared(node, propTypes.arguments[0]);
            return;
          }
          break;
        case 'IntersectionTypeAnnotation':
          ignorePropsValidation = declarePropTypesForIntersectionTypeAnnotation(propTypes, declaredPropTypes);
          break;
        case null:
          break;
        default:
          ignorePropsValidation = true;
          break;
      }

      components.set(node, {
        declaredPropTypes: declaredPropTypes,
        ignorePropsValidation: ignorePropsValidation
      });
    }

    /**
     * Reports undeclared proptypes for a given component
     * @param {Object} component The component to process
     */
    function reportUndeclaredPropTypes(component) {
      let allNames;
      for (let i = 0, j = component.usedPropTypes.length; i < j; i++) {
        allNames = component.usedPropTypes[i].allNames;
        if (
          isIgnored(allNames[0]) ||
          isDeclaredInComponent(component.node, allNames)
        ) {
          continue;
        }
        context.report(
          component.usedPropTypes[i].node,
          MISSING_MESSAGE, {
            name: allNames.join('.').replace(/\.__COMPUTED_PROP__/g, '[]')
          }
        );
      }
    }

    /**
     * Resolve the type annotation for a given node.
     * Flow annotations are sometimes wrapped in outer `TypeAnnotation`
     * and `NullableTypeAnnotation` nodes which obscure the annotation we're
     * interested in.
     * This method also resolves type aliases where possible.
     *
     * @param {ASTNode} node The annotation or a node containing the type annotation.
     * @returns {ASTNode} The resolved type annotation for the node.
     */
    function resolveTypeAnnotation(node) {
      let annotation = node.typeAnnotation || node;
      while (annotation && (annotation.type === 'TypeAnnotation' || annotation.type === 'NullableTypeAnnotation')) {
        annotation = annotation.typeAnnotation;
      }
      if (annotation.type === 'GenericTypeAnnotation' && typeScope(annotation.id.name)) {
        return typeScope(annotation.id.name);
      }
      return annotation;
    }

    /**
     * Resolve the type annotation for a given class declaration node with superTypeParameters.
     *
     * @param {ASTNode} node The annotation or a node containing the type annotation.
     * @returns {ASTNode} The resolved type annotation for the node.
     */
    function resolveSuperParameterPropsType(node) {
      let propsParameterPosition;
      try {
        // Flow <=0.52 had 3 required TypedParameters of which the second one is the Props.
        // Flow >=0.53 has 2 optional TypedParameters of which the first one is the Props.
        propsParameterPosition = versionUtil.testFlowVersion(context, '0.53.0') ? 0 : 1;
      } catch (e) {
        // In case there is no flow version defined, we can safely assume that when there are 3 Props we are dealing with version <= 0.52
        propsParameterPosition = node.superTypeParameters.params.length <= 2 ? 0 : 1;
      }

      let annotation = node.superTypeParameters.params[propsParameterPosition];
      while (annotation && (annotation.type === 'TypeAnnotation' || annotation.type === 'NullableTypeAnnotation')) {
        annotation = annotation.typeAnnotation;
      }

      if (annotation.type === 'GenericTypeAnnotation' && typeScope(annotation.id.name)) {
        return typeScope(annotation.id.name);
      }
      return annotation;
    }

    /**
     * @param {ASTNode} node We expect either an ArrowFunctionExpression,
     *   FunctionDeclaration, or FunctionExpression
     */
    function markDestructuredFunctionArgumentsAsUsed(node) {
      const destructuring = node.params && node.params[0] && node.params[0].type === 'ObjectPattern';
      if (destructuring && components.get(node)) {
        markPropTypesAsUsed(node);
      }
    }

    /**
     * @param {ASTNode} node We expect either an ArrowFunctionExpression,
     *   FunctionDeclaration, or FunctionExpression
     */
    function markAnnotatedFunctionArgumentsAsDeclared(node) {
      if (!node.params || !node.params.length || !annotations.isAnnotatedFunctionPropsDeclaration(node, context)) {
        return;
      }
      markPropTypesAsDeclared(node, resolveTypeAnnotation(node.params[0]));
    }

    /**
     * @param {ASTNode} node We expect either an ArrowFunctionExpression,
     *   FunctionDeclaration, or FunctionExpression
     */
    function handleStatelessComponent(node) {
      markDestructuredFunctionArgumentsAsUsed(node);
      markAnnotatedFunctionArgumentsAsDeclared(node);
    }


    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      ClassDeclaration: function(node) {
        if (isSuperTypeParameterPropsDeclaration(node)) {
          markPropTypesAsDeclared(node, resolveSuperParameterPropsType(node));
        }
      },

      ClassExpression: function(node) {
        // TypeParameterDeclaration need to be added to typeScope in order to handle ClassExpressions.
        // This visitor is executed before TypeParameterDeclaration are scoped, therefore we postpone
        // processing class expressions until when the program exists.
        classExpressions.push(node);
      },

      ClassProperty: function(node) {
        if (isAnnotatedClassPropsDeclaration(node)) {
          markPropTypesAsDeclared(node, resolveTypeAnnotation(node));
        } else if (propsUtil.isPropTypesDeclaration(node)) {
          markPropTypesAsDeclared(node, node.value);
        }
      },

      VariableDeclarator: function(node) {
        if (isDestructuredVariableDeclaration(node) && node.init.type !== 'MemberExpression') {
          markPropTypesAsUsed(node);
        }
      },

      FunctionDeclaration: handleStatelessComponent,

      ArrowFunctionExpression: handleStatelessComponent,

      FunctionExpression: function(node) {
        if (node.parent.type === 'MethodDefinition') {
          return;
        }
        handleStatelessComponent(node);
      },

      MemberExpression: function(node) {
        let type;
        if (propsUtil.isPropTypesDeclaration(node)) {
          type = 'declaration';
        } else if (isPropTypesUsage(node)) {
          type = 'usage';
        }

        switch (type) {
          case 'usage':
            markPropTypesAsUsed(node);
            break;
          case 'declaration':
            const component = utils.getRelatedComponent(node);
            if (!component) {
              return;
            }
            markPropTypesAsDeclared(component.node, node.parent.right || node.parent);
            break;
          default:
            break;
        }
      },

      MethodDefinition: function(node) {
        const destructuring = node.value && node.value.params && node.value.params[0] && node.value.params[0].type === 'ObjectPattern';
        if (node.key.name === 'componentWillReceiveProps' && destructuring) {
          markPropTypesAsUsed(node);
        }

        if (!node.static || node.kind !== 'get' || !propsUtil.isPropTypesDeclaration(node)) {
          return;
        }

        let i = node.value.body.body.length - 1;
        for (; i >= 0; i--) {
          if (node.value.body.body[i].type === 'ReturnStatement') {
            break;
          }
        }

        if (i >= 0) {
          markPropTypesAsDeclared(node, node.value.body.body[i].argument);
        }
      },

      ObjectExpression: function(node) {
        // Search for the proptypes declaration
        node.properties.forEach(property => {
          if (!propsUtil.isPropTypesDeclaration(property)) {
            return;
          }
          markPropTypesAsDeclared(node, property.value);
        });
      },

      TypeAlias: function(node) {
        typeScope(node.id.name, node.right);
      },

      TypeParameterDeclaration: function(node) {
        const identifier = node.params[0];

        if (identifier.typeAnnotation) {
          typeScope(identifier.name, identifier.typeAnnotation.typeAnnotation);
        }
      },

      Program: function() {
        stack = [{}];
      },

      BlockStatement: function () {
        stack.push(Object.create(typeScope()));
      },

      'BlockStatement:exit': function () {
        stack.pop();
      },

      'Program:exit': function() {
        classExpressions.forEach(node => {
          if (isSuperTypeParameterPropsDeclaration(node)) {
            markPropTypesAsDeclared(node, resolveSuperParameterPropsType(node));
          }
        });

        stack = null;
        const list = components.list();
        // Report undeclared proptypes for all classes
        for (const component in list) {
          if (!has(list, component) || !mustBeValidated(list[component])) {
            continue;
          }
          reportUndeclaredPropTypes(list[component]);
        }
      }
    };
  })
};
