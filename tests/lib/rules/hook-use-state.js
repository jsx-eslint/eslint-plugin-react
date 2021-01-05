/**
 * @fileoverview Ensure symmetric naming of setState hook value and setter variables
 * @author Duncan Beevers
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/hook-use-state');
const parsers = require('../../helpers/parsers');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
});

const tests = {
  valid: [
    {
      code: 'const [color, setColor] = useState()'
    },
    {
      code: 'const [color, setColor] = useState(\'#ffffff\')'
    },
    {
      code: 'const [color, setColor] = React.useState()'
    },
    {
      code: 'const [color1, setColor1] = useState()'
    },
    {
      code: 'const [color, setColor] = useState<string>()',
      parser: parsers.TYPESCRIPT_ESLINT
    },
    {
      code: 'const [color, setColor] = useState<string>(\'#ffffff\')',
      parser: parsers.TYPESCRIPT_ESLINT
    }
  ].concat(parsers.TS([
    {
      code: 'const [color, setColor] = useState<string>()',
      parser: parsers['@TYPESCRIPT_ESLINT']
    },
    {
      code: 'const [color, setColor] = useState<string>(\'#ffffff\')',
      parser: parsers['@TYPESCRIPT_ESLINT']
    }
  ])
  ),
  invalid: [
    {
      code: 'useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }]
    },
    {
      code: 'const result = useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }]
    },
    {
      code: 'const result = React.useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }]
    },
    {
      code: 'const [, , extra1] = useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }]
    },
    {
      code: 'const [, setColor] = useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }]
    },
    {
      code: 'const { color } = useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }]
    },
    {
      code: 'const [] = useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }]
    },
    {
      code: 'const [, , , ,] = useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }]
    },
    {
      code: 'const [color] = useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }],
      output: 'const [color, setColor] = useState()'
    },
    {
      code: 'const [color, , extra1] = useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }],
      output: 'const [color, setColor] = useState()'
    },
    {
      code: 'const [color, setColor, extra1, extra2, extra3] = useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }],
      output: 'const [color, setColor] = useState()'
    },
    {
      code: 'const [, makeColor] = useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }]
    },
    {
      code: 'const [color, setFlavor, extraneous] = useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }],
      output: 'const [color, setColor] = useState()'
    },
    {
      code: 'const [color, setFlavor] = useState()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }],
      output: 'const [color, setColor] = useState()'
    },
    {
      code: 'const [color, setFlavor] = useState<string>()',
      errors: [{
        message: 'setState call is not destructured into value + setter pair'
      }],
      output: 'const [color, setColor] = useState<string>()',
      parser: parsers.TYPESCRIPT_ESLINT
    }
  ].concat(
    parsers.TS([
      {
        code: 'const [color, setFlavor] = useState<string>()',
        errors: [{
          message: 'setState call is not destructured into value + setter pair'
        }],
        output: 'const [color, setColor] = useState<string>()',
        parser: parsers['@TYPESCRIPT_ESLINT']
      }
    ])
  )
};

ruleTester.run('hook-set-state-names', rule, tests);
