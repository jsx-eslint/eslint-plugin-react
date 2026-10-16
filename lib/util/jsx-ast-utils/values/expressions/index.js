'use strict';

const Literal = require('../Literal').default;
const JSXElement = require('../JSXElement').default;
const JSXFragment = require('../JSXFragment').default;
const JSXText = require('../JSXText').default;
const Identifier = require('./Identifier').default;
const TaggedTemplateExpression = require('./TaggedTemplateExpression').default;
const TemplateLiteral = require('./TemplateLiteral').default;
const FunctionExpression = require('./FunctionExpression').default;
const LogicalExpression = require('./LogicalExpression').default;
const MemberExpression = require('./MemberExpression').default;
const ChainExpression = require('./ChainExpression').default;
const OptionalCallExpression = require('./OptionalCallExpression').default;
const OptionalMemberExpression = require('./OptionalMemberExpression').default;
const CallExpression = require('./CallExpression').default;
const UnaryExpression = require('./UnaryExpression').default;
const ThisExpression = require('./ThisExpression').default;
const ConditionalExpression = require('./ConditionalExpression').default;
const BinaryExpression = require('./BinaryExpression').default;
const ObjectExpression = require('./ObjectExpression').default;
const NewExpression = require('./NewExpression').default;
const UpdateExpression = require('./UpdateExpression').default;
const ArrayExpression = require('./ArrayExpression').default;
const BindExpression = require('./BindExpression').default;
const SpreadElement = require('./SpreadElement').default;
const TypeCastExpression = require('./TypeCastExpression').default;
const SequenceExpression = require('./SequenceExpression').default;
const TSNonNullExpression = require('./TSNonNullExpression').default;
const AssignmentExpression = require('./AssignmentExpression').default;

const TYPES = {
  Identifier,
  Literal,
  JSXElement,
  JSXFragment,
  JSXText,
  TaggedTemplateExpression,
  TemplateLiteral,
  ArrowFunctionExpression: FunctionExpression,
  FunctionExpression,
  LogicalExpression,
  MemberExpression,
  ChainExpression,
  OptionalCallExpression,
  OptionalMemberExpression,
  CallExpression,
  UnaryExpression,
  ThisExpression,
  ConditionalExpression,
  BinaryExpression,
  ObjectExpression,
  NewExpression,
  UpdateExpression,
  ArrayExpression,
  BindExpression,
  SpreadElement,
  TypeCastExpression,
  SequenceExpression,
  TSNonNullExpression,
  AssignmentExpression,
};

const noop = () => null;

const errorMessage = (expression) => `The prop value with an expression type of ${expression} could not be resolved. Please file an issue ( https://github.com/jsx-eslint/jsx-ast-utils/issues/new ) to get this fixed immediately.`;

function extract(value) {
  let expression;
  if (
    typeof value.expression !== 'boolean'
    && value.expression
  ) {
    expression = value.expression;
  } else {
    expression = value;
  }
  let { type } = expression;

  if (expression.object && expression.object.type === 'TSNonNullExpression') {
    type = 'TSNonNullExpression';
  }

  while (type === 'TSAsExpression') {
    ({ type } = expression);
    if (expression.expression) {
      ({ expression } = expression);
    }
  }

  if (TYPES[type] === undefined) {
    console.error(errorMessage(type));
    return null;
  }

  return TYPES[type](expression);
}

const LITERAL_TYPES = {
  ...TYPES,
  Literal: (value) => {
    const extractedVal = TYPES.Literal.call(undefined, value);
    const isNull = extractedVal === null;
    return isNull ? 'null' : extractedVal;
  },
  Identifier: (value) => {
    const isUndefined = TYPES.Identifier.call(undefined, value) === undefined;
    return isUndefined ? undefined : null;
  },
  JSXElement: noop,
  JSXFragment: noop,
  JSXText: noop,
  ArrowFunctionExpression: noop,
  FunctionExpression: noop,
  LogicalExpression: noop,
  MemberExpression: noop,
  OptionalCallExpression: noop,
  OptionalMemberExpression: noop,
  CallExpression: noop,
  UnaryExpression: (value) => {
    const extractedVal = TYPES.UnaryExpression.call(undefined, value);
    return extractedVal === undefined ? null : extractedVal;
  },
  UpdateExpression: (value) => {
    const extractedVal = TYPES.UpdateExpression.call(undefined, value);
    return extractedVal === undefined ? null : extractedVal;
  },
  ThisExpression: noop,
  ConditionalExpression: noop,
  BinaryExpression: noop,
  ObjectExpression: noop,
  NewExpression: noop,
  ArrayExpression: (value) => {
    const extractedVal = TYPES.ArrayExpression.call(undefined, value);
    return extractedVal.filter((val) => val !== null);
  },
  BindExpression: noop,
  SpreadElement: noop,
  TSNonNullExpression: noop,
  TSAsExpression: noop,
  TypeCastExpression: noop,
  SequenceExpression: noop,
  ChainExpression: noop,
};

function extractLiteral(value) {
  const expression = value.expression || value;
  const { type } = expression;

  if (LITERAL_TYPES[type] === undefined) {
    console.error(errorMessage(type));
    return null;
  }

  return LITERAL_TYPES[type](expression);
}

module.exports = {
  default: extract,
  extractLiteral,
};
