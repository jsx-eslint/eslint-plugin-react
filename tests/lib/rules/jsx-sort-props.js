/**
 * @fileoverview Enforce props alphabetical sorting
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-sort-props');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});

const expectedError = {
  message: 'Props should be sorted alphabetically',
  type: 'JSXAttribute'
};
const expectedCallbackError = {
  message: 'Callbacks must be listed after all other props',
  type: 'JSXAttribute'
};
const expectedShorthandFirstError = {
  message: 'Shorthand props must be listed before all other props',
  type: 'JSXAttribute'
};
const expectedShorthandLastError = {
  message: 'Shorthand props must be listed after all other props',
  type: 'JSXAttribute'
};
const expectedReservedFirstError = {
  message: 'Reserved props must be listed before all other props',
  type: 'JSXAttribute'
};
const expectedEmptyReservedFirstError = {
  message: 'A customized reserved first list must not be empty'
};
const expectedInvalidReservedFirstError = {
  message: 'A customized reserved first list must only contain a subset of React reserved props. Remove: notReserved'
};
const callbacksLastArgs = [{
  callbacksLast: true
}];
const ignoreCaseAndCallbackLastArgs = [{
  callbacksLast: true,
  ignoreCase: true
}];
const shorthandFirstArgs = [{
  shorthandFirst: true
}];
const shorthandLastArgs = [{
  shorthandLast: true
}];
const shorthandAndCallbackLastArgs = [{
  callbacksLast: true,
  shorthandLast: true
}];
const ignoreCaseArgs = [{
  ignoreCase: true
}];
const noSortAlphabeticallyArgs = [{
  noSortAlphabetically: true
}];
const sortAlphabeticallyArgs = [{
  noSortAlphabetically: false
}];
const reservedFirstAsBooleanArgs = [{
  reservedFirst: true
}];
const reservedFirstAsArrayArgs = [{
  reservedFirst: ['children', 'dangerouslySetInnerHTML', 'key']
}];
const reservedFirstWithNoSortAlphabeticallyArgs = [{
  noSortAlphabetically: true,
  reservedFirst: true
}];
const reservedFirstWithShorthandLast = [{
  reservedFirst: true,
  shorthandLast: true
}];
const reservedFirstAsEmptyArrayArgs = [{
  reservedFirst: []
}];
const reservedFirstAsInvalidArrayArgs = [{
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
    {code: '<App z onBar onFoo />;', options: ignoreCaseAndCallbackLastArgs},
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
    },
    {
      code: '<App key="key" c="c" b />',
      options: reservedFirstWithShorthandLast
    }
  ],
  invalid: [
    {
      code: '<App b a />;',
      errors: [expectedError],
      output: '<App a b />;'
    },
    {
      code: '<App {...this.props} b a />;',
      errors: [expectedError],
      output: '<App {...this.props} a b />;'
    },
    {
      code: '<App c {...this.props} b a />;',
      errors: [expectedError],
      output: '<App c {...this.props} a b />;'
    },
    {
      code: '<App a A />;',
      errors: [expectedError],
      output: '<App a A />;'
    },
    {
      code: '<App B a />;',
      options: ignoreCaseArgs,
      errors: [expectedError],
      output: '<App a B />;'
    },
    {
      code: '<App B A c />;',
      options: ignoreCaseArgs,
      errors: [expectedError],
      output: '<App A B c />;'
    },
    {
      code: '<App c="a" a="c" b="b" />;',
      output: '<App a="c" b="b" c="a" />;',
      errors: 2
    },
    {
      code: '<App {...this.props} c="a" a="c" b="b" />;',
      output: '<App {...this.props} a="c" b="b" c="a" />;',
      errors: 2
    },
    {
      code: '<App d="d" b="b" {...this.props} c="a" a="c" />;',
      output: '<App b="b" d="d" {...this.props} a="c" c="a" />;',
      errors: 2
    },
    {
      code: `
      <App
        a={true}
        z
        r
        _onClick={function(){}}
        onHandle={function(){}}
        {...this.props}
        b={false}
        {...otherProps}
      >
        {test}
      </App>
    `,
      output: `
      <App
        _onClick={function(){}}
        a={true}
        onHandle={function(){}}
        r
        z
        {...this.props}
        b={false}
        {...otherProps}
      >
        {test}
      </App>
    `,
      errors: 3
    },
    {
      code: '<App key="key" b c="c" />',
      errors: [expectedShorthandLastError],
      options: reservedFirstWithShorthandLast
    },
    {
      code: '<App ref="ref" key="key" isShorthand veryLastAttribute="yes" />',
      errors: [expectedError, expectedShorthandLastError],
      options: reservedFirstWithShorthandLast
    },
    {
      code: '<App a z onFoo onBar />;',
      errors: [expectedError],
      options: callbacksLastArgs
    },
    {
      code: '<App a onBar onFoo z />;',
      errors: [expectedCallbackError],
      options: callbacksLastArgs
    },
    {
      code: '<App a="a" b />;',
      errors: [expectedShorthandFirstError],
      options: shorthandFirstArgs
    },
    {
      code: '<App z x a="a" />;',
      errors: [expectedError],
      options: shorthandFirstArgs
    },
    {
      code: '<App b a="a" />;',
      errors: [expectedShorthandLastError],
      options: shorthandLastArgs
    },
    {
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
      code: '<App key={2} b a />',
      options: reservedFirstAsBooleanArgs,
      output: '<App key={2} a b />',
      errors: [expectedError]
    },
    {
      code: '<App b a />',
      options: reservedFirstAsBooleanArgs,
      output: '<App a b />',
      errors: [expectedError]
    },
    {
      code: '<App dangerouslySetInnerHTML={{__html: "EPR"}} e key={2} b />',
      options: reservedFirstAsBooleanArgs,
      output: '<App key={2} b dangerouslySetInnerHTML={{__html: "EPR"}} e />',
      errors: [expectedReservedFirstError, expectedError]
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
