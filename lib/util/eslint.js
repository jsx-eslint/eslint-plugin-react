'use strict';

function getSourceCode(context) {
  return context.getSourceCode ? context.getSourceCode() : context.sourceCode;
}

module.exports = {
  getSourceCode,
};
