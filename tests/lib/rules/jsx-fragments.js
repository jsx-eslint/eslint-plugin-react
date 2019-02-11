/**
 * @fileoverview Tests for jsx-fragments
 * @author Alex Zherdev
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-fragments');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-fragments', rule, {
  valid: [
    {
      code: '<><Foo /></>',
      parser: 'babel-eslint',
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      }
    },
    {
      code: '<Act.Frag><Foo /></Act.Frag>',
      options: ['element'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      }
    },
    {
      code: '<Act.Frag />',
      options: ['element'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      }
    },
    {
      code: `
      import Act, { Frag as F } from 'react';
      <F><Foo /></F>;
    `,
      options: ['element'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      }
    },
    {
      code: `
      const F = Act.Frag;
      <F><Foo /></F>;
    `,
      options: ['element'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      }
    },
    {
      code: `
      const { Frag } = Act;
      <Frag><Foo /></Frag>;
    `,
      options: ['element'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      }
    },
    {
      code: `
      const { Frag } = require('react');
      <Frag><Foo /></Frag>;
    `,
      options: ['element'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      }
    },
    {
      code: '<Act.Frag key="key"><Foo /></Act.Frag>',
      options: ['syntax'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      }
    },
    {
      code: '<Act.Frag key="key" />',
      options: ['syntax'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      }
    },
    {
      code: '<Act.Frag key="key" />',
      options: ['syntax'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      }
    },
    // Cases for deprecated settings
    {
      code: '<><Foo /></>',
      settings: {
        react: {
          version: '16.2',
          pragma: 'Act',
          fragment: 'Frag'
        }
      }
    },
    {
      code: '<Act.Frag><Foo /></Act.Frag>',
      options: ['element'],
      settings: {
        react: {
          version: '16.2',
          pragma: 'Act',
          fragment: 'Frag'
        }
      }
    }
  ],

  invalid: [
    {
      code: '<><Foo /></>',
      parser: 'babel-eslint',
      settings: {
        react: {
          version: '16.1',
          jsxFragPragma: 'Act.Frag'
        }
      },
      errors: [{
        message: 'Fragments are only supported starting from React v16.2. '
        + 'Please disable the `react/jsx-fragments` rule in ESLint settings or upgrade your version of React.'
      }]
    },
    {
      code: '<Act.Frag><Foo /></Act.Frag>',
      settings: {
        react: {
          version: '16.1',
          jsxFragPragma: 'Act.Frag'
        }
      },
      errors: [{
        message: 'Fragments are only supported starting from React v16.2. '
        + 'Please disable the `react/jsx-fragments` rule in ESLint settings or upgrade your version of React.'
      }]
    },
    {
      code: '<Act.Frag />',
      settings: {
        react: {
          version: '16.1',
          jsxFragPragma: 'Act.Frag'
        }
      },
      errors: [{
        message: 'Fragments are only supported starting from React v16.2. '
        + 'Please disable the `react/jsx-fragments` rule in ESLint settings or upgrade your version of React.'
      }]
    },
    {
      code: '<><Foo /></>',
      parser: 'babel-eslint',
      options: ['element'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      },
      errors: [{
        message: 'Prefer Act.Frag over fragment shorthand'
      }],
      output: '<Act.Frag><Foo /></Act.Frag>'
    },
    {
      code: '<Act.Frag><Foo /></Act.Frag>',
      options: ['syntax'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      },
      errors: [{
        message: 'Prefer fragment shorthand over Act.Frag'
      }],
      output: '<><Foo /></>'
    },
    {
      code: '<Act.Frag />',
      options: ['syntax'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      },
      errors: [{
        message: 'Prefer fragment shorthand over Act.Frag'
      }],
      output: '<></>'
    },
    {
      code: `
      import Act, { Frag as F } from 'react';
      <F />;
    `,
      options: ['syntax'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      },
      errors: [{
        message: 'Prefer fragment shorthand over Act.Frag'
      }],
      output: `
      import Act, { Frag as F } from 'react';
      <></>;
    `
    },
    {
      code: `
      import Act, { Frag as F } from 'react';
      <F><Foo /></F>;
    `,
      options: ['syntax'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      },
      errors: [{
        message: 'Prefer fragment shorthand over Act.Frag'
      }],
      output: `
      import Act, { Frag as F } from 'react';
      <><Foo /></>;
    `
    },
    {
      code: `
      import Act, { Frag } from 'react';
      <Frag><Foo /></Frag>;
    `,
      options: ['syntax'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      },
      errors: [{
        message: 'Prefer fragment shorthand over Act.Frag'
      }],
      output: `
      import Act, { Frag } from 'react';
      <><Foo /></>;
    `
    },
    {
      code: `
      const F = Act.Frag;
      <F><Foo /></F>;
    `,
      options: ['syntax'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      },
      errors: [{
        message: 'Prefer fragment shorthand over Act.Frag'
      }],
      output: `
      const F = Act.Frag;
      <><Foo /></>;
    `
    },
    {
      code: `
      const { Frag } = Act;
      <Frag><Foo /></Frag>;
    `,
      options: ['syntax'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      },
      errors: [{
        message: 'Prefer fragment shorthand over Act.Frag'
      }],
      output: `
      const { Frag } = Act;
      <><Foo /></>;
    `
    },
    {
      code: `
      const { Frag } = require('react');
      <Frag><Foo /></Frag>;
    `,
      options: ['syntax'],
      settings: {
        react: {
          version: '16.2',
          jsxFragPragma: 'Act.Frag'
        }
      },
      errors: [{
        message: 'Prefer fragment shorthand over Act.Frag'
      }],
      output: `
      const { Frag } = require('react');
      <><Foo /></>;
    `
    },
    // Cases for deprecated settings
    {
      code: '<><Foo /></>',
      options: ['element'],
      settings: {
        react: {
          version: '16.2',
          pragma: 'Act',
          fragment: 'Frag'
        }
      },
      errors: [{
        message: 'Prefer Act.Frag over fragment shorthand'
      }],
      output: '<Act.Frag><Foo /></Act.Frag>'
    },
    {
      code: '<Act.Frag><Foo /></Act.Frag>',
      options: ['syntax'],
      settings: {
        react: {
          version: '16.2',
          pragma: 'Act',
          fragment: 'Frag'
        }
      },
      errors: [{
        message: 'Prefer fragment shorthand over Act.Frag'
      }],
      output: '<><Foo /></>'
    }
  ]
});
