/**
 * @fileoverview Require all forwardRef components include a ref parameter
 * @author Tiger Oakes
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/forward-ref-uses-ref');
const parsers = require('../../helpers/parsers');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

const tests = {
  valid: parsers.all([
    {
      code: `
        import { forwardRef } from 'react'
        forwardRef((props, ref) => {
          return null;
        });
      `,
    },
    {
      code: `
        import { forwardRef } from 'react'
        forwardRef((props, ref) => null);
      `,
    },
    {
      code: `
        import { forwardRef } from 'react'
        forwardRef(function (props, ref) {
          return null;
        });
      `,
    },
    {
      code: `
        import { forwardRef } from 'react'
        forwardRef(function Component(props, ref) {
          return null;
        });
      `,
    },
    {
      code: `
        import * as React from 'react'
        React.forwardRef((props, ref) => {
          return null;
        });
      `,
    },
    {
      code: `
        import * as React from 'react'
        React.forwardRef((props, ref) => null);
      `,
    },
    {
      code: `
        import * as React from 'react'
        React.forwardRef(function (props, ref) {
          return null;
        });
      `,
    },
    {
      code: `
        import * as React from 'react'
        React.forwardRef(function Component(props, ref) {
          return null;
        });
      `,
    },
    {
      code: `
        import * as React from 'react'
        function Component(props) {
          return null;
        };
      `,
    },
    {
      code: `
        import * as React from 'react'
        (props) => null;
      `,
    },
  ]),
  invalid: parsers.all([
    {
      code: `
        import { forwardRef } from 'react'
        forwardRef((props) => {
          return null;
        });
      `,
      errors: [
        {
          message: 'forwardRef is used with this component but no ref parameter is set',
          suggestions: [
            {
              messageId: 'addRefParameter',
              output: `
        import { forwardRef } from 'react'
        forwardRef((props, ref) => {
          return null;
        });
      `,
            },
            {
              messageId: 'removeForwardRef',
              output: `
        import { forwardRef } from 'react'
        (props) => {
          return null;
        };
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        import { forwardRef } from 'react'
        forwardRef(props => {
          return null;
        });
      `,
      errors: [
        {
          message: 'forwardRef is used with this component but no ref parameter is set',
          suggestions: [
            {
              messageId: 'addRefParameter',
              output: `
        import { forwardRef } from 'react'
        forwardRef((props, ref) => {
          return null;
        });
      `,
            },
            {
              messageId: 'removeForwardRef',
              output: `
        import { forwardRef } from 'react'
        props => {
          return null;
        };
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        import * as React from 'react'
        React.forwardRef((props) => null);
      `,
      errors: [
        {
          message: 'forwardRef is used with this component but no ref parameter is set',
          suggestions: [
            {
              messageId: 'addRefParameter',
              output: `
        import * as React from 'react'
        React.forwardRef((props, ref) => null);
      `,
            },
            {
              messageId: 'removeForwardRef',
              output: `
        import * as React from 'react'
        (props) => null;
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        import { forwardRef } from 'react'
        forwardRef(function (props) {
          return null;
        });
      `,
      errors: [
        {
          message: 'forwardRef is used with this component but no ref parameter is set',
          suggestions: [
            {
              messageId: 'addRefParameter',
              output: `
        import { forwardRef } from 'react'
        forwardRef(function (props, ref) {
          return null;
        });
      `,
            },
            {
              messageId: 'removeForwardRef',
              output: `
        import { forwardRef } from 'react'
        function (props) {
          return null;
        };
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        import * as React from 'react'
        React.forwardRef(function Component(props) {
          return null;
        });
      `,
      errors: [
        {
          message: 'forwardRef is used with this component but no ref parameter is set',
          suggestions: [
            {
              messageId: 'addRefParameter',
              output: `
        import * as React from 'react'
        React.forwardRef(function Component(props, ref) {
          return null;
        });
      `,
            },
            {
              messageId: 'removeForwardRef',
              output: `
        import * as React from 'react'
        function Component(props) {
          return null;
        };
      `,
            },
          ],
        },
      ],
    },
  ]),
};

ruleTester.run('forward-ref-uses-ref', rule, tests);
