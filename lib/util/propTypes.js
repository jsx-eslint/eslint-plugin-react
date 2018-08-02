'use strict';

const annotations = require('./annotations');
const propsUtil = require('./props');
const variableUtil = require('./variable');
const versionUtil = require('./version');

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
function getKeyValue(context, node) {
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
function iterateProperties(context, properties, fn) {
  if (properties && properties.length && typeof fn === 'function') {
    for (let i = 0, j = properties.length; i < j; i++) {
      const node = properties[i];
      const key = getKeyValue(context, node);

      const value = node.value;
      fn(key, value);
    }
  }
}

module.exports = {
  instructions(context, components, utils) {
    let stack = null;

    // Used to track the type annotations in scope.
    // Necessary because babel's scopes do not track type annotations.
    const classExpressions = [];
    const defaults = {skipShapeProps: true, customValidators: []};
    const configuration = Object.assign({}, defaults, context.options[0] || {});
    const customValidators = configuration.customValidators;
    const skipShapeProps = configuration.skipShapeProps;
    const sourceCode = context.getSourceCode();
    const propWrapperFunctions = new Set(context.settings.propWrapperFunctions || []);

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
     * Checks if prop should be validated by plugin-react-proptypes
     * @param {String} validator Name of validator to check.
     * @returns {Boolean} True if validator should be checked by custom validator.
     */
    function hasCustomValidator(validator) {
      return customValidators.indexOf(validator) !== -1;
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
     * Creates the representation of the React props type annotation for the component.
     * The representation is used to verify nested used properties.
     * @param {ASTNode} annotation Type annotation for the props class property.
     * @return {Object} The representation of the declaration, empty object means
     *    the property is declared without the need for further analysis.
     */
    function buildTypeAnnotationDeclarationTypes(annotation, parentName, seen) {
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
            return buildTypeAnnotationDeclarationTypes(typeScope(annotation.id.name), parentName, seen);
          }
          return {};
        case 'ObjectTypeAnnotation':
          if (skipShapeProps) {
            return {};
          }
          let containsObjectTypeSpread = false;
          const shapeTypeDefinition = {
            type: 'shape',
            children: {}
          };
          iterateProperties(context, annotation.properties, (childKey, childValue) => {
            const fullName = [parentName, childKey].join('.');
            if (!childKey && !childValue) {
              containsObjectTypeSpread = true;
            } else {
              const types = buildTypeAnnotationDeclarationTypes(childValue, fullName, seen);
              types.fullName = fullName;
              types.name = childKey;
              types.node = childValue;
              shapeTypeDefinition.children[childKey] = types;
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
            const type = buildTypeAnnotationDeclarationTypes(annotation.types[i], parentName, seen);
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
          const fullName = [parentName, '*'].join('.');
          return {
            type: 'object',
            children: {
              __ANY_KEY__: buildTypeAnnotationDeclarationTypes(annotation.elementType, fullName, seen)
            }
          };
        default:
          // Unknown or accepts everything.
          return {};
      }
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

      iterateProperties(context, propTypes.properties, (key, value) => {
        if (!value) {
          ignorePropsValidation = true;
          return;
        }

        const types = buildTypeAnnotationDeclarationTypes(value, key);
        types.fullName = key;
        types.name = key;
        types.node = value;
        declaredPropTypes[key] = types;
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

        // Type can't be resolved
        if (!annotation.id) {
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
     * Creates the representation of the React propTypes for the component.
     * The representation is used to verify nested used properties.
     * @param {ASTNode} value Node of the PropTypes for the desired property
     * @return {Object} The representation of the declaration, empty object means
     *    the property is declared without the need for further analysis.
     */
    function buildReactDeclarationTypes(value, parentName) {
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
            if (skipShapeProps) {
              return {};
            }

            if (argument.type !== 'ObjectExpression') {
              // Invalid proptype or cannot analyse statically
              return {};
            }
            const shapeTypeDefinition = {
              type: 'shape',
              children: {}
            };
            iterateProperties(context, argument.properties, (childKey, childValue) => {
              const fullName = [parentName, childKey].join('.');
              const types = buildReactDeclarationTypes(childValue, fullName);
              types.fullName = fullName;
              types.name = childKey;
              types.node = childValue;
              shapeTypeDefinition.children[childKey] = types;
            });
            return shapeTypeDefinition;
          case 'arrayOf':
          case 'objectOf':
            const fullName = [parentName, '*'].join('.');
            const child = buildReactDeclarationTypes(argument, fullName);
            child.fullName = fullName;
            child.name = '__ANY_KEY__';
            child.node = argument;
            return {
              type: 'object',
              children: {
                __ANY_KEY__: child
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
              const type = buildReactDeclarationTypes(argument.elements[i], parentName);
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
      let ignorePropsValidation = component && component.ignorePropsValidation || false;

      switch (propTypes && propTypes.type) {
        case 'ObjectTypeAnnotation':
          ignorePropsValidation = declarePropTypesForObjectTypeAnnotation(propTypes, declaredPropTypes);
          break;
        case 'ObjectExpression':
          iterateProperties(context, propTypes.properties, (key, value) => {
            if (!value) {
              ignorePropsValidation = true;
              return;
            }
            const types = buildReactDeclarationTypes(value, key);
            types.fullName = key;
            types.name = key;
            types.node = value;
            declaredPropTypes[key] = types;
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
            const types = buildReactDeclarationTypes(
              propTypes.parent.right,
              propTypes.parent.left.object.property.name
            );
            types.name = propTypes.property.name;
            types.node = propTypes.property;
            types.fullName = propTypes.property.name;
            curDeclaredPropTypes[propTypes.property.name] = types;
          } else {
            ignorePropsValidation = true;
          }
          break;
        case 'Identifier':
          const variablesInScope = variableUtil.variablesInScope(context);
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

    return {
      ClassExpression: function(node) {
        // TypeParameterDeclaration need to be added to typeScope in order to handle ClassExpressions.
        // This visitor is executed before TypeParameterDeclaration are scoped, therefore we postpone
        // processing class expressions until when the program exists.
        classExpressions.push(node);
      },

      ClassDeclaration: function(node) {
        if (isSuperTypeParameterPropsDeclaration(node)) {
          markPropTypesAsDeclared(node, resolveSuperParameterPropsType(node));
        }
      },

      ClassProperty: function(node) {
        if (isAnnotatedClassPropsDeclaration(node)) {
          markPropTypesAsDeclared(node, resolveTypeAnnotation(node));
        } else if (propsUtil.isPropTypesDeclaration(node)) {
          markPropTypesAsDeclared(node, node.value);
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

      FunctionExpression: function(node) {
        if (node.parent.type !== 'MethodDefinition') {
          markAnnotatedFunctionArgumentsAsDeclared(node);
        }
      },

      FunctionDeclaration: markAnnotatedFunctionArgumentsAsDeclared,

      ArrowFunctionExpression: markAnnotatedFunctionArgumentsAsDeclared,

      MemberExpression: function(node) {
        if (propsUtil.isPropTypesDeclaration(node)) {
          const component = utils.getRelatedComponent(node);
          if (!component) {
            return;
          }
          markPropTypesAsDeclared(component.node, node.parent.right || node.parent);
        }
      },

      MethodDefinition: function(node) {
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

      JSXSpreadAttribute: function(node) {
        const component = components.get(utils.getParentComponent());
        components.set(component ? component.node : node, {
          ignorePropsValidation: true
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
      }
    };
  },

  iterateProperties: iterateProperties
};
