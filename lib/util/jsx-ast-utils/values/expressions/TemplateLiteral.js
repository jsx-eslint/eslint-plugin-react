'use strict';

function sortStarts(a, b) {
  return (a.range ? a.range[0] : a.start) - (b.range ? b.range[0] : b.start);
}

function extractValueFromTemplateLiteral(value) {
  const {
    quasis,
    expressions,
  } = value;
  const partitions = quasis.concat(expressions);

  return partitions.sort(sortStarts).map(({ type, value: { raw } = /** @type {{ raw?: string }} */ ({}), name }) => {
    if (type === 'TemplateElement') {
      return raw;
    }

    if (type === 'Identifier') {
      return name === 'undefined' ? name : `{${name}}`;
    }

    if (type.indexOf('Expression') > -1) {
      return `{${type}}`;
    }

    return '';
  }).join('');
}

module.exports = {
  default: extractValueFromTemplateLiteral,
};
