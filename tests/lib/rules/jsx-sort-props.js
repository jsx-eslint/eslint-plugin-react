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
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});

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
var expectedReservedFirstError = {
  message: 'Reserved props must be listed before all other props',
  type: 'JSXAttribute'
};
var expectedEmptyReservedFirstError = {
  message: 'A customized reserved first list must not be empty'
};
var expectedInvalidReservedFirstError = {
  message: 'A customized reserved first list must only contain a subset of React reserved props. Remove: notReserved'
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
var reservedFirstAsBooleanArgs = [{
  reservedFirst: true
}];
var reservedFirstAsArrayArgs = [{
  reservedFirst: ['children', 'dangerouslySetInnerHTML', 'key']
}];
var reservedFirstWithNoSortAlphabeticallyArgs = [{
  noSortAlphabetically: true,
  reservedFirst: true
}];
var reservedFirstAsEmptyArrayArgs = [{
  reservedFirst: []
}];
var reservedFirstAsInvalidArrayArgs = [{
  reservedFirst: ['notReserved']
}];

ruleTester.run('jsx-sort-props', rule, {
  valid: [
    {code: '<App />;'},
    {code: '<App {...this.props} />;'},
    {code: '<App a b c />;'},
    {code: '<App {...this.props} a b c />;'},
    {code: '<App c {...this.props} a b />;'},
    {code: '<App a="c" b="b" c="a" />;'},
    {code: '<App {...this.props} a="c" b="b" c="a" />;'},
    {code: '<App c="a" {...this.props} a="c" b="b" />;'},
    {code: '<App A a />;'},
    // Ignoring case
    {code: '<App a A />;', options: ignoreCaseArgs},
    {code: '<App a B c />;', options: ignoreCaseArgs},
    {code: '<App A b C />;', options: ignoreCaseArgs},
    // Sorting callbacks below all other props
    {code: '<App a z onBar onFoo />;', options: callbacksLastArgs},
    // Sorting shorthand props before others
    {code: '<App a b="b" />;', options: shorthandFirstArgs},
    {code: '<App z a="a" />;', options: shorthandFirstArgs},
    {code: '<App x y z a="a" b="b" />;', options: shorthandFirstArgs},
    {code: '<App a="a" b="b" x y z />;', options: shorthandLastArgs},
    {
      code: '<App a="a" b="b" x y z onBar onFoo />;',
      options: shorthandAndCallbackLastArgs
    },
    // noSortAlphabetically
    {code: '<App a b />;', options: noSortAlphabeticallyArgs},
    {code: '<App b a />;', options: noSortAlphabeticallyArgs},
    // reservedFirst
    {
      code: '<App children={<App />} key={0} ref="r" a b c />',
      options: reservedFirstAsBooleanArgs
    },
    {
      code: '<App children={<App />} key={0} ref="r" a b c dangerouslySetInnerHTML={{__html: "EPR"}} />',
      options: reservedFirstAsBooleanArgs
    },
    {
      code: '<App children={<App />} key={0} a ref="r" />',
      options: reservedFirstAsArrayArgs
    },
    {
      code: '<App children={<App />} key={0} a dangerouslySetInnerHTML={{__html: "EPR"}} ref="r" />',
      options: reservedFirstAsArrayArgs
    },
    {
      code: '<App ref="r" key={0} children={<App />} b a c />',
      options: reservedFirstWithNoSortAlphabeticallyArgs
    },
    {
      code: '<div ref="r" dangerouslySetInnerHTML={{__html: "EPR"}} key={0} children={<App />} b a c />',
      options: reservedFirstWithNoSortAlphabeticallyArgs
    }
  ],
  invalid: [
    {code: '<App b a />;', errors: [expectedError]},
    {code: '<App {...this.props} b a />;', errors: [expectedError]},
    {code: '<App c {...this.props} b a />;', errors: [expectedError]},
    {code: '<App a A />;', errors: [expectedError]},
    {code: '<App B a />;', options: ignoreCaseArgs, errors: [expectedError]},
    {code: '<App B A c />;', options: ignoreCaseArgs, errors: [expectedError]},
    {code: '<App c="a" a="c" b="b" />;', errors: 2},
    {code: '<App {...this.props} c="a" a="c" b="b" />;', errors: 2},
    {code: '<App d="d" b="b" {...this.props} c="a" a="c" />;', errors: 2},
    {
      code: '<App a z onFoo onBar />;',
      errors: [expectedError],
      options: callbacksLastArgs
    }, {
      code: '<App a onBar onFoo z />;',
      errors: [expectedCallbackError],
      options: callbacksLastArgs
    }, {
      code: '<App a="a" b />;',
      errors: [expectedShorthandFirstError],
      options: shorthandFirstArgs
    },
    {code: '<App z x a="a" />;', errors: [expectedError], options: shorthandFirstArgs}, {
      code: '<App b a="a" />;',
      errors: [expectedShorthandLastError],
      options: shorthandLastArgs
    }, {
      code: '<App a="a" onBar onFoo z x />;',
      errors: [shorthandAndCallbackLastArgs],
      options: shorthandLastArgs
    },
    {code: '<App b a />;', errors: [expectedError], options: sortAlphabeticallyArgs},
    // reservedFirst
    {
      code: '<App a key={1} />',
      options: reservedFirstAsBooleanArgs,
      errors: [expectedReservedFirstError]
    },
    {
      code: '<div a dangerouslySetInnerHTML={{__html: "EPR"}} />',
      options: reservedFirstAsBooleanArgs,
      errors: [expectedReservedFirstError]
    },
    {
      code: '<App ref="r" key={2} b />',
      options: reservedFirstAsBooleanArgs,
      errors: [expectedError]
    },
    {
      code: '<App dangerouslySetInnerHTML={{__html: "EPR"}} key={2} b />',
      options: reservedFirstAsBooleanArgs,
      errors: [expectedReservedFirstError]
    },
    {
      code: '<App key={3} children={<App />} />',
      options: reservedFirstAsArrayArgs,
      errors: [expectedError]
    },
    {
      code: '<App z ref="r" />',
      options: reservedFirstWithNoSortAlphabeticallyArgs,
      errors: [expectedReservedFirstError]
    },
    {
      code: '<App key={4} />',
      options: reservedFirstAsEmptyArrayArgs,
      errors: [expectedEmptyReservedFirstError]
    },
    {
      code: '<App key={5} />',
      options: reservedFirstAsInvalidArrayArgs,
      errors: [expectedInvalidReservedFirstError]
    }
  ]
});
