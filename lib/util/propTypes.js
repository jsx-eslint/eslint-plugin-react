/**
 * @fileoverview Common propTypes detection functionality.
 */

'use strict';

const flatMap = require('array.prototype.flatmap');

const annotations = require('./annotations');
const propsUtil = require('./props');
const variableUtil = require('./variable');
const versionUtil = require('./version');
const propWrapperUtil = require('./propWrapper');
const getKeyValue = require('./ast').getKeyValue;

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
 * Iterates through a properties node, like a customized forEach.
 * @param {Object} context Array of properties to iterate.
 * @param {Object[]} properties Array of properties to iterate.
 * @param {Function} fn Function to call on each property, receives property key
    and property value. (key, value) => void
  * @param {Function} [handleSpreadFn] Function to call on each ObjectTypeSpreadProperty, receives the
    argument
 */
function iterateProperties(context, properties, fn, handleSpreadFn) {
  if (properties && properties.length && typeof fn === 'function') {
    for (let i = 0, j = properties.length; i < j; i++) {
      const node = properties[i];
      const key = getKeyValue(context, node);

      if (node.type === 'ObjectTypeSpreadProperty' && typeof handleSpreadFn === 'function') {
        handleSpreadFn(node.argument);
      }

      const value = node.value;
      fn(key, value, node);
    }
  }
}

/**
 * Checks if a node is inside a class body.
 *
 * @param {ASTNode} node  the AST node being checked.
 * @returns {Boolean} True if the node has a ClassBody ancestor, false if not.
 */
function isInsideClassBody(node) {
  let parent = node.parent;
  while (parent) {
    if (parent.type === 'ClassBody') {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}

module.exports = function propTypesInstructions(context, components, utils) {
  // Used to track the type annotations in scope.
  // Necessary because babel's scopes do not track type annotations.
  let stack = null;

  const classExpressions = [];
  const defaults = {customValidators: []};
  const configuration = Object.assign({}, defaults, context.options[0] || {});
  const customValidators = configuration.customValidators;

  /**
   * Returns the full scope.
   * @returns {Object} The whole scope.
   */
  function typeScope() {
    return stack[stack.length - 1];
  }

  /**
   * Gets a node from the scope.
   * @param {string} key The name of the identifier to access.
   * @returns {ASTNode} The ASTNode associated with the given identifier.
   */
  function getInTypeScope(key) {
    return stack[stack.length - 1][key];
  }

  /**
   * Sets the new value in the scope.
   * @param {string} key The name of the identifier to access
   * @param {ASTNode} value The new value for the identifier.
   * @returns {ASTNode} The ASTNode associated with the given identifier.
   */
  function setInTypeScope(key, value) {
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

  /* eslint-disable no-use-before-define */
  /** @type {TypeDeclarationBuilders} */
  const typeDeclarationBuilders = {
    GenericTypeAnnotation(annotation, parentName, seen) {
      if (getInTypeScope(annotation.id.name)) {
        return buildTypeAnnotationDeclarationTypes(getInTypeScope(annotation.id.name), parentName, seen);
      }
      return {};
    },

    ObjectTypeAnnotation(annotation, parentName, seen) {
      let containsUnresolvedObjectTypeSpread = false;
      let containsSpread = false;
      const containsIndexers = Boolean(annotation.indexers && annotation.indexers.length);
      const shapeTypeDefinition = {
        type: 'shape',
        children: {}
      };
      iterateProperties(context, annotation.properties, (childKey, childValue, propNode) => {
        const fullName = [parentName, childKey].join('.');
        if (childKey || childValue) {
          const types = buildTypeAnnotationDeclarationTypes(childValue, fullName, seen);
          types.fullName = fullName;
          types.name = childKey;
          types.node = propNode;
          types.isRequired = !childValue.optional;
          shapeTypeDefinition.children[childKey] = types;
        }
      },
      (spreadNode) => {
        const key = getKeyValue(context, spreadNode);
        const types = buildTypeAnnotationDeclarationTypes(spreadNode, key, seen);
        if (!types.children) {
          containsUnresolvedObjectTypeSpread = true;
        } else {
          Object.assign(shapeTypeDefinition, types.children);
        }
        containsSpread = true;
      });

      // Mark if this shape has spread or an indexer. We will know to consider all props from this shape as having propTypes,
      // but still have the ability to detect unused children of this shape.
      shapeTypeDefinition.containsUnresolvedSpread = containsUnresolvedObjectTypeSpread;
      shapeTypeDefinition.containsIndexers = containsIndexers;
      // Deprecated: containsSpread is not used anymore in the codebase, ensure to keep API backward compatibility
      shapeTypeDefinition.containsSpread = containsSpread;

      return shapeTypeDefinition;
    },

    UnionTypeAnnotation(annotation, parentName, seen) {
      /** @type {UnionTypeDefinition} */
      const unionTypeDefinition = {
        type: 'union',
        children: annotation.types.map((type) => buildTypeAnnotationDeclarationTypes(type, parentName, seen))
      };
      if (unionTypeDefinition.children.length === 0) {
        // no complex type found, simply accept everything
        return {};
      }
      return unionTypeDefinition;
    },

    ArrayTypeAnnotation(annotation, parentName, seen) {
      const fullName = [parentName, '*'].join('.');
      const child = buildTypeAnnotationDeclarationTypes(annotation.elementType, fullName, seen);
      child.fullName = fullName;
      child.name = '__ANY_KEY__';
      child.node = annotation;
      return {
        type: 'object',
        children: {
          __ANY_KEY__: child
        }
      };
    }
  };
  /* eslint-enable no-use-before-define */

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
    let annotation = (node.left && node.left.typeAnnotation) || node.typeAnnotation || node;
    while (annotation && (annotation.type === 'TypeAnnotation' || annotation.type === 'NullableTypeAnnotation')) {
      annotation = annotation.typeAnnotation;
    }
    if (annotation.type === 'GenericTypeAnnotation' && getInTypeScope(annotation.id.name)) {
      return getInTypeScope(annotation.id.name);
    }
    return annotation;
  }

  /**
   * Creates the representation of the React props type annotation for the component.
   * The representation is used to verify nested used properties.
   * @param {ASTNode} annotation Type annotation for the props class property.
   * @param {String} parentName
   * @param {Set<ASTNode>} [seen]
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

    if (annotation.type in typeDeclarationBuilders) {
      return typeDeclarationBuilders[annotation.type](annotation, parentName, seen);
    }
    return {};
  }

  /**
   * Marks all props found inside ObjectTypeAnnotation as declared.
   *
   * Modifies the declaredProperties object
   * @param {ASTNode} propTypes
   * @param {Object} declaredPropTypes
   * @returns {Boolean} True if propTypes should be ignored (e.g. when a type can't be resolved, when it is imported)
   */
  function declarePropTypesForObjectTypeAnnotation(propTypes, declaredPropTypes) {
    let ignorePropsValidation = false;

    iterateProperties(context, propTypes.properties, (key, value, propNode) => {
      if (!value) {
        ignorePropsValidation = ignorePropsValidation || propNode.type !== 'ObjectTypeSpreadProperty';
        return;
      }

      const types = buildTypeAnnotationDeclarationTypes(value, key);
      types.fullName = key;
      types.name = key;
      types.node = propNode;
      types.isRequired = !propNode.optional;
      declaredPropTypes[key] = types;
    }, (spreadNode) => {
      const key = getKeyValue(context, spreadNode);
      const spreadAnnotation = getInTypeScope(key);
      if (!spreadAnnotation) {
        ignorePropsValidation = true;
      } else {
        const spreadIgnoreValidation = declarePropTypesForObjectTypeAnnotation(spreadAnnotation, declaredPropTypes);
        ignorePropsValidation = ignorePropsValidation || spreadIgnoreValidation;
      }
    });

    return ignorePropsValidation;
  }

  function declarePropTypesForTSTypeAnnotation(propTypes, declaredPropTypes) {
    let foundDeclaredPropertiesList = [];
    if (propTypes.typeAnnotation.type === 'TSTypeReference') {
      const typeName = propTypes.typeAnnotation.typeName.name;
      if (!typeName) {
        return true;
      }
      // the game here is to find the type declaration in the code
      const candidateTypes = context.getSourceCode().ast.body.filter((item) => item.type === 'VariableDeclaration' && item.kind === 'type');
      const declarations = flatMap(candidateTypes, (type) => type.declarations);

      // we tried to find either an interface or a type with the TypeReference name
      const typeDeclaration = declarations.find((dec) => dec.id.name === typeName);
      const interfaceDeclaration = context.getSourceCode().ast.body.find((item) => item.type === 'TSInterfaceDeclaration' && item.id.name === typeName);

      if (typeDeclaration) {
        foundDeclaredPropertiesList = typeDeclaration.init.members;
      } else if (interfaceDeclaration) {
        foundDeclaredPropertiesList = interfaceDeclaration.body.body;
      } else {
        // type not found, for example can be an exported type, etc. Can issue a warning in the future.
        return true;
      }
    } else if (propTypes.typeAnnotation.type === 'TSTypeLiteral') {
      foundDeclaredPropertiesList = propTypes.typeAnnotation.members;
    } else {
      // weird cases such as TSTypeFunction
      return true;
    }

    foundDeclaredPropertiesList.forEach((tsInterfaceBody) => {
      if (tsInterfaceBody.type === 'TSPropertySignature') {
        let accessor = 'name';
        if (tsInterfaceBody.key.type === 'Literal') {
          if (typeof tsInterfaceBody.key.value === 'number') {
            accessor = 'raw';
          } else {
            accessor = 'value';
          }
        }
        declaredPropTypes[tsInterfaceBody.key[accessor]] = {
          fullName: tsInterfaceBody.key[accessor],
          name: tsInterfaceBody.key[accessor],
          node: tsInterfaceBody,
          isRequired: !tsInterfaceBody.optional
        };
      }
    });
    return false;
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
    return propTypes.types.some((annotation) => {
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

      const typeNode = getInTypeScope(annotation.id.name);

      if (!typeNode) {
        return true;
      }
      if (typeNode.type === 'IntersectionTypeAnnotation') {
        return declarePropTypesForIntersectionTypeAnnotation(typeNode, declaredPropTypes);
      }

      return declarePropTypesForObjectTypeAnnotation(typeNode, declaredPropTypes);
    });
  }

  /**
   * Resolve node of type Identifier when building declaration types.
   * @param {ASTNode} node
   * @param {Function} callback called with the resolved value only if resolved.
   */
  function resolveValueForIdentifierNode(node, callback) {
    if (
      node
      && node.type === 'Identifier'
    ) {
      const scope = context.getScope();
      const identVariable = scope.variableScope.variables.find(
        (variable) => variable.name === node.name
      );
      if (identVariable) {
        const definition = identVariable.defs[identVariable.defs.length - 1];
        callback(definition.node.init);
      }
    }
  }

  /**
   * Creates the representation of the React propTypes for the component.
   * The representation is used to verify nested used properties.
   * @param {ASTNode} value Node of the PropTypes for the desired property
   * @param {string} parentName
   * @return {Object} The representation of the declaration, empty object means
   *    the property is declared without the need for further analysis.
   */
  function buildReactDeclarationTypes(value, parentName) {
    if (
      value
      && value.callee
      && value.callee.object
      && hasCustomValidator(value.callee.object.name)
    ) {
      return {};
    }

    let identNodeResolved = false;
    // Resolve identifier node for cases where isRequired is set in
    // the variable declaration or not at all.
    // const variableType = PropTypes.shape({ foo: ... }).isRequired
    // propTypes = {
    //   example: variableType
    // }
    // --------
    // const variableType = PropTypes.shape({ foo: ... })
    // propTypes = {
    //   example: variableType
    // }
    resolveValueForIdentifierNode(value, (newValue) => {
      identNodeResolved = true;
      value = newValue;
    });

    if (
      value
      && value.type === 'MemberExpression'
      && value.property
      && value.property.name
      && value.property.name === 'isRequired'
    ) {
      value = value.object;
    }

    // Resolve identifier node for cases where isRequired is set in
    // the prop types.
    // const variableType = PropTypes.shape({ foo: ... })
    // propTypes = {
    //   example: variableType.isRequired
    // }
    if (!identNodeResolved) {
      resolveValueForIdentifierNode(value, (newValue) => {
        value = newValue;
      });
    }

    // Verify PropTypes that are functions
    if (
      value
      && value.type === 'CallExpression'
      && value.callee
      && value.callee.property
      && value.callee.property.name
      && value.arguments
      && value.arguments.length > 0
    ) {
      const callName = value.callee.property.name;
      const argument = value.arguments[0];
      switch (callName) {
        case 'shape': {
          if (argument.type !== 'ObjectExpression') {
            // Invalid proptype or cannot analyse statically
            return {};
          }
          const shapeTypeDefinition = {
            type: 'shape',
            children: {}
          };
          iterateProperties(context, argument.properties, (childKey, childValue, propNode) => {
            if (childValue) { // skip spread propTypes
              const fullName = [parentName, childKey].join('.');
              const types = buildReactDeclarationTypes(childValue, fullName);
              types.fullName = fullName;
              types.name = childKey;
              types.node = propNode;
              shapeTypeDefinition.children[childKey] = types;
            }
          });
          return shapeTypeDefinition;
        }
        case 'arrayOf':
        case 'objectOf': {
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
        }
        case 'oneOfType': {
          if (
            !argument.elements
            || !argument.elements.length
          ) {
            // Invalid proptype or cannot analyse statically
            return {};
          }

          /** @type {UnionTypeDefinition} */
          const unionTypeDefinition = {
            type: 'union',
            children: argument.elements.map((element) => buildReactDeclarationTypes(element, parentName))
          };
          if (unionTypeDefinition.children.length === 0) {
            // no complex type found, simply accept everything
            return {};
          }
          return unionTypeDefinition;
        }
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
   * @param {ASTNode} propTypes The AST node containing the proptypes
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
        iterateProperties(context, propTypes.properties, (key, value, propNode) => {
          if (!value) {
            ignorePropsValidation = true;
            return;
          }
          const types = buildReactDeclarationTypes(value, key);
          types.fullName = key;
          types.name = key;
          types.node = propNode;
          types.isRequired = propsUtil.isRequiredPropType(value);
          declaredPropTypes[key] = types;
        });
        break;
      case 'MemberExpression': {
        let curDeclaredPropTypes = declaredPropTypes;
        // Walk the list of properties, until we reach the assignment
        // ie: ClassX.propTypes.a.b.c = ...
        while (
          propTypes
          && propTypes.parent
          && propTypes.parent.type !== 'AssignmentExpression'
          && propTypes.property
          && curDeclaredPropTypes
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
          if (!(propTypes === propTypes.parent.left && propTypes.parent.left.object)) {
            ignorePropsValidation = true;
            break;
          }
          const parentProp = context.getSource(propTypes.parent.left.object).replace(/^.*\.propTypes\./, '');
          const types = buildReactDeclarationTypes(
            propTypes.parent.right,
            parentProp
          );

          types.name = propTypes.property.name;
          types.fullName = [parentProp, propTypes.property.name].join('.');
          types.node = propTypes.parent;
          types.isRequired = propsUtil.isRequiredPropType(propTypes.parent.right);
          curDeclaredPropTypes[propTypes.property.name] = types;
        } else {
          let isUsedInPropTypes = false;
          let n = propTypes;
          while (n) {
            if (n.type === 'AssignmentExpression' && propsUtil.isPropTypesDeclaration(n.left)
              || (n.type === 'ClassProperty' || n.type === 'Property') && propsUtil.isPropTypesDeclaration(n)) {
              // Found a propType used inside of another propType. This is not considered usage, we'll still validate
              // this component.
              isUsedInPropTypes = true;
              break;
            }
            n = n.parent;
          }
          if (!isUsedInPropTypes) {
            ignorePropsValidation = true;
          }
        }
        break;
      }
      case 'Identifier': {
        const variablesInScope = variableUtil.variablesInScope(context);
        const firstMatchingVariable = variablesInScope
          .find((variableInScope) => variableInScope.name === propTypes.name);
        if (firstMatchingVariable) {
          const defInScope = firstMatchingVariable.defs[firstMatchingVariable.defs.length - 1];
          markPropTypesAsDeclared(node, defInScope.node && defInScope.node.init);
          return;
        }
        ignorePropsValidation = true;
        break;
      }
      case 'CallExpression': {
        if (
          propWrapperUtil.isPropWrapperFunction(
            context,
            context.getSourceCode().getText(propTypes.callee)
          )
          && propTypes.arguments && propTypes.arguments[0]
        ) {
          markPropTypesAsDeclared(node, propTypes.arguments[0]);
          return;
        }
        break;
      }
      case 'IntersectionTypeAnnotation':
        ignorePropsValidation = declarePropTypesForIntersectionTypeAnnotation(propTypes, declaredPropTypes);
        break;
      case 'GenericTypeAnnotation':
        if (propTypes.id.name === '$ReadOnly') {
          ignorePropsValidation = declarePropTypesForObjectTypeAnnotation(
            propTypes.typeParameters.params[0],
            declaredPropTypes
          );
        } else {
          ignorePropsValidation = true;
        }
        break;
      case 'TSTypeAnnotation':
        ignorePropsValidation = declarePropTypesForTSTypeAnnotation(propTypes, declaredPropTypes);
        break;
      case null:
        break;
      default:
        ignorePropsValidation = true;
        break;
    }

    components.set(node, {
      declaredPropTypes,
      ignorePropsValidation
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

    if (isInsideClassBody(node)) {
      return;
    }

    // Should ignore function that not return JSXElement
    if (!utils.isReturningJSXSomewhere(node)) {
      return;
    }

    const param = node.params[0];
    if (param.typeAnnotation && param.typeAnnotation.typeAnnotation && param.typeAnnotation.typeAnnotation.type === 'UnionTypeAnnotation') {
      param.typeAnnotation.typeAnnotation.types.forEach((annotation) => {
        if (annotation.type === 'GenericTypeAnnotation') {
          markPropTypesAsDeclared(node, resolveTypeAnnotation(annotation));
        } else {
          markPropTypesAsDeclared(node, annotation);
        }
      });
    } else {
      markPropTypesAsDeclared(node, resolveTypeAnnotation(param));
    }
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

    if (annotation && annotation.type === 'GenericTypeAnnotation' && getInTypeScope(annotation.id.name)) {
      return getInTypeScope(annotation.id.name);
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
          tokens[0].value === 'props'
          || (tokens[1] && tokens[1].value === 'props')
        )
      ) {
        return true;
      }
    }
    return false;
  }

  return {
    ClassExpression(node) {
      // TypeParameterDeclaration need to be added to typeScope in order to handle ClassExpressions.
      // This visitor is executed before TypeParameterDeclaration are scoped, therefore we postpone
      // processing class expressions until when the program exists.
      classExpressions.push(node);
    },

    ClassDeclaration(node) {
      if (isSuperTypeParameterPropsDeclaration(node)) {
        markPropTypesAsDeclared(node, resolveSuperParameterPropsType(node));
      }
    },

    ClassProperty(node) {
      if (isAnnotatedClassPropsDeclaration(node)) {
        markPropTypesAsDeclared(node, resolveTypeAnnotation(node));
      } else if (propsUtil.isPropTypesDeclaration(node)) {
        markPropTypesAsDeclared(node, node.value);
      }
    },

    ObjectExpression(node) {
      // Search for the proptypes declaration
      node.properties.forEach((property) => {
        if (!propsUtil.isPropTypesDeclaration(property)) {
          return;
        }
        markPropTypesAsDeclared(node, property.value);
      });
    },

    FunctionExpression(node) {
      if (node.parent.type !== 'MethodDefinition') {
        markAnnotatedFunctionArgumentsAsDeclared(node);
      }
    },

    FunctionDeclaration: markAnnotatedFunctionArgumentsAsDeclared,

    ArrowFunctionExpression: markAnnotatedFunctionArgumentsAsDeclared,

    MemberExpression(node) {
      if (propsUtil.isPropTypesDeclaration(node)) {
        const component = utils.getRelatedComponent(node);
        if (!component) {
          return;
        }
        markPropTypesAsDeclared(component.node, node.parent.right || node.parent);
      }
    },

    MethodDefinition(node) {
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

    TypeAlias(node) {
      setInTypeScope(node.id.name, node.right);
    },

    TypeParameterDeclaration(node) {
      const identifier = node.params[0];

      if (identifier.typeAnnotation) {
        setInTypeScope(identifier.name, identifier.typeAnnotation.typeAnnotation);
      }
    },

    Program() {
      stack = [{}];
    },

    BlockStatement() {
      stack.push(Object.create(typeScope()));
    },

    'BlockStatement:exit'() {
      stack.pop();
    },

    'Program:exit'() {
      classExpressions.forEach((node) => {
        if (isSuperTypeParameterPropsDeclaration(node)) {
          markPropTypesAsDeclared(node, resolveSuperParameterPropsType(node));
        }
      });
    }
  };
};
