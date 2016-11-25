/**
 * @fileoverview Enforce props alphabetical sorting
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-sort-props');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();

var expectedError = {
  message: 'Props should be sorted alphabetically',
  type: 'JSXAttribute'
};
var expectedCallbackError = {
  message: 'Callbacks must be listed after all other props',
  type: 'JSXAttribute'
};
var expectedShorthandFirstError = {
  message: 'Shorthand props must be listed before all other props',
  type: 'JSXAttribute'
};
var expectedShorthandLastError = {
  message: 'Shorthand props must be listed after all other props',
  type: 'JSXAttribute'
};
var callbacksLastArgs = [{
  callbacksLast: true
}];
var shorthandFirstArgs = [{
  shorthandFirst: true
}];
var shorthandLastArgs = [{
  shorthandLast: true
}];
var shorthandAndCallbackLastArgs = [{
  callbacksLast: true,
  shorthandLast: true
}];
var ignoreCaseArgs = [{
  ignoreCase: true
}];
var noSortAlphabeticallyArgs = [{
  noSortAlphabetically: true
}];
var sortAlphabeticallyArgs = [{
  noSortAlphabetically: false
}];

ruleTester.run('jsx-sort-props', rule, {
  valid: [
    {code: '<App />;', parserOptions: parserOptions},
    {code: '<App {...this.props} />;', parserOptions: parserOptions},
    {code: '<App a b c />;', parserOptions: parserOptions},
    {code: '<App {...this.props} a b c />;', parserOptions: parserOptions},
    {code: '<App c {...this.props} a b />;', parserOptions: parserOptions},
    {code: '<App a="c" b="b" c="a" />;', parserOptions: parserOptions},
    {code: '<App {...this.props} a="c" b="b" c="a" />;', parserOptions: parserOptions},
    {code: '<App c="a" {...this.props} a="c" b="b" />;', parserOptions: parserOptions},
    {code: '<App A a />;', parserOptions: parserOptions},
    // Ignoring case
    {code: '<App a A />;', options: ignoreCaseArgs, parserOptions: parserOptions},
    {code: '<App a B c />;', options: ignoreCaseArgs, parserOptions: parserOptions},
    {code: '<App A b C />;', options: ignoreCaseArgs, parserOptions: parserOptions},
    // Sorting callbacks below all other props
    {code: '<App a z onBar onFoo />;', options: callbacksLastArgs, parserOptions: parserOptions},
    // Sorting shorthand props before others
    {code: '<App a b="b" />;', options: shorthandFirstArgs, parserOptions: parserOptions},
    {code: '<App z a="a" />;', options: shorthandFirstArgs, parserOptions: parserOptions},
    {code: '<App x y z a="a" b="b" />;', options: shorthandFirstArgs, parserOptions: parserOptions},
    {code: '<App a="a" b="b" x y z />;', options: shorthandLastArgs, parserOptions: parserOptions},
    {
      code: '<App a="a" b="b" x y z onBar onFoo />;',
      options: shorthandAndCallbackLastArgs,
      parserOptions: parserOptions
    },
    // noSortAlphabetically
    {code: '<App a b />;', options: noSortAlphabeticallyArgs, parserOptions: parserOptions},
    {code: '<App b a />;', options: noSortAlphabeticallyArgs, parserOptions: parserOptions}
  ],
  invalid: [
    {code: '<App b a />;', errors: [expectedError], parserOptions: parserOptions},
    {code: '<App {...this.props} b a />;', errors: [expectedError], parserOptions: parserOptions},
    {code: '<App c {...this.props} b a />;', errors: [expectedError], parserOptions: parserOptions},
    {code: '<App a A />;', errors: [expectedError], parserOptions: parserOptions},
    {code: '<App B a />;', options: ignoreCaseArgs, errors: [expectedError], parserOptions: parserOptions},
    {code: '<App B A c />;', options: ignoreCaseArgs, errors: [expectedError], parserOptions: parserOptions},
    {code: '<App c="a" a="c" b="b" />;', errors: 2, parserOptions: parserOptions},
    {code: '<App {...this.props} c="a" a="c" b="b" />;', errors: 2, parserOptions: parserOptions},
    {code: '<App d="d" b="b" {...this.props} c="a" a="c" />;', errors: 2, parserOptions: parserOptions},
    {
      code: '<App a z onFoo onBar />;',
      errors: [expectedError],
      options: callbacksLastArgs,
      parserOptions: parserOptions
    }, {
      code: '<App a onBar onFoo z />;',
      errors: [expectedCallbackError],
      options: callbacksLastArgs,
      parserOptions: parserOptions
    }, {
      code: '<App a="a" b />;',
      errors: [expectedShorthandFirstError],
      options: shorthandFirstArgs,
      parserOptions: parserOptions
    },
    {code: '<App z x a="a" />;', errors: [expectedError], options: shorthandFirstArgs, parserOptions: parserOptions}, {
      code: '<App b a="a" />;',
      errors: [expectedShorthandLastError],
      options: shorthandLastArgs,
      parserOptions: parserOptions
    }, {
      code: '<App a="a" onBar onFoo z x />;',
      errors: [shorthandAndCallbackLastArgs],
      options: shorthandLastArgs,
      parserOptions: parserOptions
    },
    {code: '<App b a />;', errors: [expectedError], options: sortAlphabeticallyArgs, parserOptions: parserOptions}
  ]
});
