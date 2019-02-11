/**
 * @fileoverview Utility functions for React pragma configuration
 * @author Yannick Croissant
 */
'use strict';

const JSX_ANNOTATION_REGEX = /^\*\s*@jsx\s+([^\s]+)/;
const JSX_FRAGMENT_ANNOTATION_REGEX = /^\*\s*@jsxFrag\s+([^\s]+)/;
// Does not check for reserved keywords or unicode characters
const JS_IDENTIFIER_OR_MEMBER_REGEX = /^[_$a-zA-Z][_$a-zA-Z0-9.]*$/;

function getJsxFromReactSettings(react) {
  let jsxPragmaObject = 'React';

  if (react.jsxPragma) {
    return react.jsxPragma;
  }

  if (react.pragma) {
    jsxPragmaObject = react.pragma;
  }

  return `${jsxPragmaObject}.createElement`;
}

function getJsxFragFromReactSettings(react) {
  let jsxFragPragmaObject = 'React';
  let jsxFragPragmaProperty = 'Fragment';

  if (react.jsxFragPragma) {
    return react.jsxFragPragma;
  }

  if (react.pragma) {
    jsxFragPragmaObject = react.pragma;
  }

  if (react.fragment) {
    jsxFragPragmaProperty = react.fragment;
  }

  return `${jsxFragPragmaObject}.${jsxFragPragmaProperty}`;
}

function getCreateClassFromContext(context) {
  let pragma = 'createReactClass';
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (context.settings.react && context.settings.react.createClass) {
    pragma = context.settings.react.createClass;
  }
  if (!JS_IDENTIFIER_OR_MEMBER_REGEX.test(pragma)) {
    throw new Error(`createClass pragma ${pragma} is not a valid function name`);
  }
  return pragma;
}

function getFragmentFromContext(context) {
  let pragma = 'Fragment';
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (context.settings.react && context.settings.react.fragment) {
    pragma = context.settings.react.fragment;
  }
  if (!JS_IDENTIFIER_OR_MEMBER_REGEX.test(pragma)) {
    throw new Error(`Fragment pragma ${pragma} is not a valid identifier`);
  }
  return pragma;
}

function getFromContext(context) {
  let pragma = 'React';

  const sourceCode = context.getSourceCode();
  const pragmaNode = sourceCode.getAllComments().find(node => JSX_ANNOTATION_REGEX.test(node.value));

  if (pragmaNode) {
    const matches = JSX_ANNOTATION_REGEX.exec(pragmaNode.value);
    pragma = matches[1].split('.')[0];
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  } else if (context.settings.react && context.settings.react.pragma) {
    pragma = context.settings.react.pragma;
  }

  if (!JS_IDENTIFIER_OR_MEMBER_REGEX.test(pragma)) {
    throw new Error(`React pragma ${pragma} is not a valid identifier`);
  }
  return pragma;
}

function getJsxFromContext(context) {
  let jsxPragma = 'React.createElement';

  const sourceCode = context.getSourceCode();
  const jsxPragmaNode = sourceCode.getAllComments().find(node => JSX_ANNOTATION_REGEX.test(node.value));

  if (jsxPragmaNode) {
    const matches = JSX_ANNOTATION_REGEX.exec(jsxPragmaNode.value);
    jsxPragma = matches[1];
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  } else if (context.settings.react) {
    jsxPragma = getJsxFromReactSettings(context.settings.react);
  }

  if (!JS_IDENTIFIER_OR_MEMBER_REGEX.test(jsxPragma)) {
    throw new Error(`jsxPragma ${jsxPragma} is not a valid identifier`);
  }
  return jsxPragma;
}

function getJsxFragFromContext(context) {
  let jsxFragPragma = 'React.Fragment';

  const sourceCode = context.getSourceCode();
  const jsxFragPragmaNode = sourceCode.getAllComments().find(node => JSX_FRAGMENT_ANNOTATION_REGEX.test(node.value));

  if (jsxFragPragmaNode) {
    const matches = JSX_FRAGMENT_ANNOTATION_REGEX.exec(jsxFragPragmaNode.value);
    jsxFragPragma = matches[1];
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  } else if (context.settings.react) {
    jsxFragPragma = getJsxFragFromReactSettings(context.settings.react);
  }

  if (!JS_IDENTIFIER_OR_MEMBER_REGEX.test(jsxFragPragma)) {
    throw new Error(`jsxFragPragma ${jsxFragPragma} is not a valid identifier`);
  }
  return jsxFragPragma;
}

module.exports = {
  getCreateClassFromContext: getCreateClassFromContext,
  getFragmentFromContext: getFragmentFromContext,
  getFromContext: getFromContext,
  getJsxFromContext: getJsxFromContext,
  getJsxFragFromContext: getJsxFragFromContext
};
