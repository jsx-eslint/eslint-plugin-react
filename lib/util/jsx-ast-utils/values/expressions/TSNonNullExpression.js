'use strict';

const extractValueFromThisExpression = require('./ThisExpression').default;
const extractValueFromCallExpression = require('./CallExpression').default;

function navigate(obj, prop, value) {
  if (value.computed) {
    return value.optional ? `${obj}?.[${prop}]` : `${obj}[${prop}]`;
  }
  return value.optional ? `${obj}?.${prop}` : `${obj}.${prop}`;
}

function extractValueFromTSNonNullExpression(value) {
  const errorMessage = 'The prop value with an expression type of TSNonNullExpression could not be resolved. Please file an issue ( https://github.com/jsx-eslint/jsx-ast-utils/issues/new ) to get this fixed immediately.';

  if (value.type === 'Identifier') {
    const { name } = value;
    return name;
  }

  if (value.type === 'Literal') {
    return value.value;
  }

  if (value.type === 'TSAsExpression') {
    return extractValueFromTSNonNullExpression(value.expression);
  }

  if (value.type === 'CallExpression') {
    return extractValueFromCallExpression(value);
  }

  if (value.type === 'ThisExpression') {
    return extractValueFromThisExpression();
  }

  if (value.type === 'TSNonNullExpression' && (!value.extra || value.extra.parenthesized === false)) {
    const { expression } = value;
    return `${extractValueFromTSNonNullExpression(expression)}${'!'}`;
  }

  if (value.type === 'TSNonNullExpression' && value.extra && value.extra.parenthesized === true) {
    const { expression } = value;
    return `${'('}${extractValueFromTSNonNullExpression(expression)}${'!'}${')'}`;
  }

  if (value.type === 'MemberExpression') {
    if ((!value.extra || value.extra.parenthesized === false)) {
      return navigate(
        extractValueFromTSNonNullExpression(value.object),
        extractValueFromTSNonNullExpression(value.property),
        value,
      );
    }

    if (value.extra && value.extra.parenthesized === true) {
      const result = navigate(
        extractValueFromTSNonNullExpression(value.object),
        extractValueFromTSNonNullExpression(value.property),
        value,
      );
      return `(${result})`;
    }
  }

  if (value.expression) {
    let { expression } = value;
    while (expression) {
      if (expression.type === 'Identifier') {
        console.error(errorMessage);
        return expression.name;
      }
      ({ expression } = expression);
    }
  }

  console.error(errorMessage);
  return '';
}

module.exports = {
  default: extractValueFromTSNonNullExpression,
};
