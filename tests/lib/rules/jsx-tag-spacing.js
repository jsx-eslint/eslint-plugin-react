/**
 * @fileoverview Tests for jsx-tag-spacing
 * @author Diogo Franco (Kovensky)
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-tag-spacing');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

// generate options object that disables checks other than the tested one

function closingSlashOptions(option) {
  return [
    {
      closingSlash: option,
      beforeSelfClosing: 'allow',
      afterOpening: 'allow',
      beforeClosing: 'allow',
    },
  ];
}

function beforeSelfClosingOptions(option) {
  return [
    {
      closingSlash: 'allow',
      beforeSelfClosing: option,
      afterOpening: 'allow',
      beforeClosing: 'allow',
    },
  ];
}

function afterOpeningOptions(option) {
  return [
    {
      closingSlash: 'allow',
      beforeSelfClosing: 'allow',
      afterOpening: option,
      beforeClosing: 'allow',
    },
  ];
}

function beforeClosingOptions(option) {
  return [
    {
      closingSlash: 'allow',
      beforeSelfClosing: 'allow',
      afterOpening: 'allow',
      beforeClosing: option,
    },
  ];
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-tag-spacing', rule, {
  valid: parsers.all([
    {
      code: '<App />',
    },
    {
      code: '<App />',
      options: beforeSelfClosingOptions('always'),
    },
    {
      code: '<App foo />',
      options: beforeSelfClosingOptions('always'),
    },
    {
      code: '<App foo={bar} />',
      options: beforeSelfClosingOptions('always'),
    },
    {
      code: '<App {...props} />',
      options: beforeSelfClosingOptions('always'),
    },
    {
      code: '<App></App>',
      options: beforeSelfClosingOptions('always'),
    },
    {
      code: `
        <App
          foo={bar}
        />
      `,
      options: beforeSelfClosingOptions('always'),
    },
    {
      code: '<App/>',
      options: beforeSelfClosingOptions('never'),
    },
    {
      code: '<App foo/>',
      options: beforeSelfClosingOptions('never'),
    },
    {
      code: '<App foo={bar}/>',
      options: beforeSelfClosingOptions('never'),
    },
    {
      code: '<App {...props}/>',
      options: beforeSelfClosingOptions('never'),
    },
    {
      code: '<App></App>',
      options: beforeSelfClosingOptions('never'),
    },
    {
      code: `
        <App
          foo={bar}
        />
      `,
      options: beforeSelfClosingOptions('never'),
    },
    {
      code: '<App/>;',
      options: closingSlashOptions('never'),
    },
    {
      code: '<App />;',
      options: closingSlashOptions('never'),
    },
    {
      code: '<div className="bar"></div>;',
      options: closingSlashOptions('never'),
    },
    {
      code: '<div className="bar"></ div>;',
      options: closingSlashOptions('never'),
    },
    {
      code: '<App prop="foo">< /App>',
      options: closingSlashOptions('always'),
      features: ['no-ts'],
    },
    {
      code: '<p/ >',
      options: closingSlashOptions('always'),
    },
    {
      code: '<App/>',
      options: afterOpeningOptions('never'),
    },
    {
      code: '<App></App>',
      options: afterOpeningOptions('never'),
    },
    {
      code: '< App></ App>',
      options: afterOpeningOptions('always'),
      features: ['no-ts'],
    },
    {
      code: '< App/>',
      options: afterOpeningOptions('always'),
    },
    {
      code: `
        <
        App/>
      `,
      options: afterOpeningOptions('allow-multiline'),
    },
    {
      code: '<App />',
      options: beforeClosingOptions('never'),
    },
    {
      code: '<App></App>',
      options: beforeClosingOptions('never'),
    },
    {
      code: `
        <App
        foo="bar"
        >
        </App>
      `,
      options: beforeClosingOptions('never'),
    },
    {
      code: `
        <App
           foo="bar"
        >
        </App>
      `,
      options: beforeClosingOptions('never'),
    },
    {
      code: '<App ></App >',
      options: beforeClosingOptions('always'),
    },
    {
      code: `
        <App
        foo="bar"
        >
        </App >
      `,
      options: beforeClosingOptions('always'),
    },
    {
      code: `
        <App
            foo="bar"
        >
        </App >
      `,
      options: beforeClosingOptions('always'),
    },
    {
      code: '<App/>',
      options: [
        {
          closingSlash: 'never',
          beforeSelfClosing: 'never',
          afterOpening: 'never',
          beforeClosing: 'never',
        },
      ],
    },
    {
      code: '< App / >',
      options: [
        {
          closingSlash: 'always',
          beforeSelfClosing: 'always',
          afterOpening: 'always',
          beforeClosing: 'always',
        },
      ],
    },
  ]),

  invalid: parsers.all([
    {
      code: '<App/>',
      output: '<App />',
      options: beforeSelfClosingOptions('always'),
      errors: [{ messageId: 'beforeSelfCloseNeedSpace' }],
    },
    {
      code: '<App foo/>',
      output: '<App foo />',
      options: beforeSelfClosingOptions('always'),
      errors: [{ messageId: 'beforeSelfCloseNeedSpace' }],
    },
    {
      code: '<App foo={bar}/>',
      output: '<App foo={bar} />',
      options: beforeSelfClosingOptions('always'),
      errors: [{ messageId: 'beforeSelfCloseNeedSpace' }],
    },
    {
      code: '<App {...props}/>',
      output: '<App {...props} />',
      options: beforeSelfClosingOptions('always'),
      errors: [{ messageId: 'beforeSelfCloseNeedSpace' }],
    },
    {
      code: '<App />',
      output: '<App/>',
      options: beforeSelfClosingOptions('never'),
      errors: [{ messageId: 'beforeSelfCloseNoSpace' }],
    },
    {
      code: '<App foo />',
      output: '<App foo/>',
      options: beforeSelfClosingOptions('never'),
      errors: [{ messageId: 'beforeSelfCloseNoSpace' }],
    },
    {
      code: '<App foo={bar} />',
      output: '<App foo={bar}/>',
      options: beforeSelfClosingOptions('never'),
      errors: [{ messageId: 'beforeSelfCloseNoSpace' }],
    },
    {
      code: '<App {...props} />',
      output: '<App {...props}/>',
      options: beforeSelfClosingOptions('never'),
      errors: [{ messageId: 'beforeSelfCloseNoSpace' }],
    },
    {
      code: '<App/ >;',
      output: '<App/>;',
      errors: [{ messageId: 'selfCloseSlashNoSpace' }],
      options: closingSlashOptions('never'),
    },
    {
      code: `
        <App_selfCloseSlashNoSpace/
        >
      `,
      output: `
        <App_selfCloseSlashNoSpace/>
      `,
      errors: [{ messageId: 'selfCloseSlashNoSpace' }],
      options: closingSlashOptions('never'),
    },
    {
      code: '<div className="bar">< /div>;',
      output: '<div className="bar"></div>;',
      errors: [{ messageId: 'closeSlashNoSpace' }],
      options: closingSlashOptions('never'),
      features: ['no-ts'],
    },
    {
      code: `
        <div className="bar"><
        /div>;
      `,
      output: `
        <div className="bar"></div>;
      `,
      errors: [{ messageId: 'closeSlashNoSpace' }],
      options: closingSlashOptions('never'),
      features: ['no-ts'],
    },
    {
      code: '<App prop="foo"></App>',
      output: '<App prop="foo">< /App>',
      errors: [{ messageId: 'closeSlashNeedSpace' }],
      options: closingSlashOptions('always'),
      features: ['no-ts'],
    },
    {
      code: '<p/>',
      output: '<p/ >',
      errors: [{ messageId: 'selfCloseSlashNeedSpace' }],
      options: closingSlashOptions('always'),
    },
    {
      code: '< App/>',
      output: '<App/>',
      errors: [{ messageId: 'afterOpenNoSpace' }],
      options: afterOpeningOptions('never'),
    },
    {
      code: '< App></App>',
      output: '<App></App>',
      errors: [{ messageId: 'afterOpenNoSpace' }],
      options: afterOpeningOptions('never'),
    },
    {
      code: '<App></ App>',
      output: '<App></App>',
      errors: [{ messageId: 'afterOpenNoSpace' }],
      options: afterOpeningOptions('never'),
    },
    {
      code: '< App></ App>',
      output: '<App></App>',
      errors: [
        { messageId: 'afterOpenNoSpace' },
        { messageId: 'afterOpenNoSpace' },
      ],
      options: afterOpeningOptions('never'),
    },
    {
      code: `
        <
        App1/>
      `,
      output: `
        <App1/>
      `,
      errors: [{ messageId: 'afterOpenNoSpace' }],
      options: afterOpeningOptions('never'),
    },
    {
      code: '<App2></ App2>',
      output: '< App2></ App2>',
      errors: [{ messageId: 'afterOpenNeedSpace' }],
      options: afterOpeningOptions('always'),
    },
    {
      code: '< App3></App3>',
      output: '< App3></ App3>',
      errors: [{ messageId: 'afterOpenNeedSpace' }],
      options: afterOpeningOptions('always'),
    },
    {
      code: '<App4></App4>',
      output: '< App4></ App4>',
      errors: [
        { messageId: 'afterOpenNeedSpace' },
        { messageId: 'afterOpenNeedSpace' },
      ],
      options: afterOpeningOptions('always'),
    },
    {
      code: '<App5/>',
      output: '< App5/>',
      errors: [{ messageId: 'afterOpenNeedSpace' }],
      options: afterOpeningOptions('always'),
    },
    {
      code: '< App6/>',
      output: '<App6/>',
      errors: [{ messageId: 'afterOpenNoSpace' }],
      options: afterOpeningOptions('allow-multiline'),
    },
    {
      code: '<App7 ></App7>',
      output: '<App7></App7>',
      errors: [{ messageId: 'beforeCloseNoSpace' }],
      options: beforeClosingOptions('never'),
    },
    {
      code: '<App8></App8 >',
      output: '<App8></App8>',
      errors: [{ messageId: 'beforeCloseNoSpace' }],
      options: beforeClosingOptions('never'),
    },
    {
      code: `
        <App9
        foo="bar"
        >
        </App9 >
      `,
      output: `
        <App9
        foo="bar"
        >
        </App9>
      `,
      errors: [{ messageId: 'beforeCloseNoSpace' }],
      options: beforeClosingOptions('never'),
    },
    {
      code: '<App10></App10 >',
      output: '<App10 ></App10 >',
      errors: [{ messageId: 'beforeCloseNeedSpace' }],
      options: beforeClosingOptions('always'),
    },
    {
      code: '<App11 ></App11>',
      output: '<App11 ></App11 >',
      errors: [{ messageId: 'beforeCloseNeedSpace' }],
      options: beforeClosingOptions('always'),
    },
    {
      code: `
        <App12
        foo="bar"
        >
        </App12>
      `,
      output: `
        <App12
        foo="bar"
        >
        </App12 >
      `,
      errors: [{ messageId: 'beforeCloseNeedSpace' }],
      options: beforeClosingOptions('always'),
    },
  ]),
});
