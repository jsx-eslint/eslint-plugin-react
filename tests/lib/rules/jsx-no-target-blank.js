/**
 * @fileoverview Forbid target='_blank' attribute
 * @author Kevin Miller
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-no-target-blank');

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
const defaultErrors = [{
  message: 'Using target="_blank" without rel="noreferrer" is a security risk:'
  + ' see https://html.spec.whatwg.org/multipage/links.html#link-type-noopener'
}];

ruleTester.run('jsx-no-target-blank', rule, {
  valid: [
    {code: '<a href="foobar"></a>'},
    {code: '<a randomTag></a>'},
    {code: '<a target />'},
    {code: '<a href="foobar" target="_blank" rel="noopener noreferrer"></a>'},
    {code: '<a href="foobar" target="_blank" rel="noreferrer"></a>'},
    {code: '<a href="foobar" target="_blank" rel={"noopener noreferrer"}></a>'},
    {code: '<a href="foobar" target="_blank" rel={"noreferrer"}></a>'},
    {code: '<a href={"foobar"} target={"_blank"} rel={"noopener noreferrer"}></a>'},
    {code: '<a href={"foobar"} target={"_blank"} rel={"noreferrer"}></a>'},
    {code: '<a href={\'foobar\'} target={\'_blank\'} rel={\'noopener noreferrer\'}></a>'},
    {code: '<a href={\'foobar\'} target={\'_blank\'} rel={\'noreferrer\'}></a>'},
    {code: '<a href={`foobar`} target={`_blank`} rel={`noopener noreferrer`}></a>'},
    {code: '<a href={`foobar`} target={`_blank`} rel={`noreferrer`}></a>'},
    {code: '<a target="_blank" {...spreadProps} rel="noopener noreferrer"></a>'},
    {code: '<a target="_blank" {...spreadProps} rel="noreferrer"></a>'},
    {code: '<a {...spreadProps} target="_blank" rel="noopener noreferrer" href="http://example.com">s</a>'},
    {code: '<a {...spreadProps} target="_blank" rel="noreferrer" href="http://example.com">s</a>'},
    {code: '<a target="_blank" rel="noopener noreferrer" {...spreadProps}></a>'},
    {code: '<a target="_blank" rel="noreferrer" {...spreadProps}></a>'},
    {code: '<p target="_blank"></p>'},
    {code: '<a href="foobar" target="_BLANK" rel="NOOPENER noreferrer"></a>'},
    {code: '<a href="foobar" target="_BLANK" rel="NOREFERRER"></a>'},
    {code: '<a target="_blank" rel={relValue}></a>'},
    {code: '<a target={targetValue} rel="noopener noreferrer"></a>'},
    {code: '<a target={targetValue} rel="noreferrer"></a>'},
    {code: '<a target={targetValue} rel={"noopener noreferrer"}></a>'},
    {code: '<a target={targetValue} rel={"noreferrer"}></a>'},
    {code: '<a target={targetValue} href="relative/path"></a>'},
    {code: '<a target={targetValue} href="/absolute/path"></a>'},
    {code: '<a target={\'targetValue\'} href="/absolute/path"></a>'},
    {code: '<a target={"targetValue"} href="/absolute/path"></a>'},
    {code: '<a target={null} href="//example.com"></a>'},
    {
      code: '<a {...someObject} href="/absolute/path"></a>',
      options: [{enforceDynamicLinks: 'always', warnOnSpreadAttributes: true}]
    },
    {
      code: '<a {...someObject} rel="noreferrer"></a>',
      options: [{enforceDynamicLinks: 'always', warnOnSpreadAttributes: true}]
    },
    {
      code: '<a {...someObject} rel="noreferrer" target="_blank"></a>',
      options: [{enforceDynamicLinks: 'always', warnOnSpreadAttributes: true}]
    },
    {
      code: '<a {...someObject} href="foobar" target="_blank"></a>',
      options: [{enforceDynamicLinks: 'always', warnOnSpreadAttributes: true}]
    },
    {
      code: '<a target="_blank" href={ dynamicLink }></a>',
      options: [{enforceDynamicLinks: 'never'}]
    },
    {
      code: '<a target={"_blank"} href={ dynamicLink }></a>',
      options: [{enforceDynamicLinks: 'never'}]
    },
    {
      code: '<a target={\'_blank\'} href={ dynamicLink }></a>',
      options: [{enforceDynamicLinks: 'never'}]
    },
    {
      code: '<Link target="_blank" href={ dynamicLink }></Link>',
      options: [{enforceDynamicLinks: 'never'}],
      settings: {linkComponents: ['Link']}
    },
    {
      code: '<Link target="_blank" to={ dynamicLink }></Link>',
      options: [{enforceDynamicLinks: 'never'}],
      settings: {linkComponents: {name: 'Link', linkAttribute: 'to'}}
    },
    {
      code: '<a href="foobar" target="_blank" rel="noopener"></a>',
      options: [{allowReferrer: true}]
    },
    {
      code: '<a target={3} />'
    }
  ],
  invalid: [
    {
      code: '<a target="_blank" href="http://example.com/1"></a>',
      output: '<a target="_blank" href="http://example.com/1" rel="noreferrer"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" rel="" href="http://example.com/2"></a>',
      output: '<a target="_blank" rel="noreferrer" href="http://example.com/2"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" rel={0} href="http://example.com/3"></a>',
      output: '<a target="_blank" rel="noreferrer" href="http://example.com/3"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" rel={1} href="http://example.com/3"></a>',
      output: '<a target="_blank" rel="noreferrer" href="http://example.com/3"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" rel={false} href="http://example.com/4"></a>',
      output: '<a target="_blank" rel="noreferrer" href="http://example.com/4"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" rel={null} href="http://example.com/5"></a>',
      output: '<a target="_blank" rel="noreferrer" href="http://example.com/5"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" rel="noopenernoreferrer" href="http://example.com/6"></a>',
      output: '<a target="_blank" rel="noopener noreferrer" href="http://example.com/6"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" rel="no referrer" href="http://example.com/7"></a>',
      output: '<a target="_blank" rel="no referrer noreferrer" href="http://example.com/7"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_BLANK" href="http://example.com/8"></a>',
      output: '<a target="_BLANK" href="http://example.com/8" rel="noreferrer"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" href="//example.com/9"></a>',
      output: '<a target="_blank" href="//example.com/9" rel="noreferrer"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" href="//example.com/10" rel={true}></a>',
      output: '<a target="_blank" href="//example.com/10" rel="noreferrer"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" href="//example.com/11" rel={3}></a>',
      output: '<a target="_blank" href="//example.com/11" rel="noreferrer"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" href="//example.com/12" rel={null}></a>',
      output: '<a target="_blank" href="//example.com/12" rel="noreferrer"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" href="//example.com/13" rel={getRel()}></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" href="//example.com/14" rel={"noopenernoreferrer"}></a>',
      output: '<a target="_blank" href="//example.com/14" rel={"noopener noreferrer"}></a>',
      errors: defaultErrors
    },
    {
      code: '<a target={"_blank"} href={"//example.com/15"} rel={"noopenernoreferrer"}></a>',
      output: '<a target={"_blank"} href={"//example.com/15"} rel={"noopener noreferrer"}></a>',
      errors: defaultErrors
    },
    {
      code: '<a target={"_blank"} href={"//example.com/16"} rel={"noopenernoreferrernoreferrernoreferrernoreferrernoreferrer"}></a>',
      output: '<a target={"_blank"} href={"//example.com/16"} rel={"noopener noreferrer"}></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" href="//example.com/17" rel></a>',
      output: '<a target="_blank" href="//example.com/17" rel="noreferrer"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" href={ dynamicLink }></a>',
      output: '<a target="_blank" href={ dynamicLink } rel="noreferrer"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target={\'_blank\'} href="//example.com/18"></a>',
      output: '<a target={\'_blank\'} href="//example.com/18" rel="noreferrer"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target={"_blank"} href="//example.com/19"></a>',
      output: '<a target={"_blank"} href="//example.com/19" rel="noreferrer"></a>',
      errors: defaultErrors
    },
    {
      code: '<a target="_blank" href={ dynamicLink }></a>',
      output: '<a target="_blank" href={ dynamicLink } rel="noreferrer"></a>',
      options: [{enforceDynamicLinks: 'always'}],
      errors: defaultErrors
    },
    {
      code: '<a {...someObject}></a>',
      options: [{enforceDynamicLinks: 'always', warnOnSpreadAttributes: true}],
      errors: defaultErrors
    },
    {
      code: '<a {...someObject} target="_blank"></a>',
      options: [{enforceDynamicLinks: 'always', warnOnSpreadAttributes: true}],
      errors: defaultErrors
    },
    {
      code: '<a href="foobar" {...someObject} target="_blank"></a>',
      options: [{enforceDynamicLinks: 'always', warnOnSpreadAttributes: true}],
      errors: defaultErrors
    },
    {
      code: '<a href="foobar" target="_blank" rel="noreferrer" {...someObject}></a>',
      options: [{enforceDynamicLinks: 'always', warnOnSpreadAttributes: true}],
      errors: defaultErrors
    },
    {
      code: '<a href="foobar" target="_blank" {...someObject}></a>',
      options: [{enforceDynamicLinks: 'always', warnOnSpreadAttributes: true}],
      errors: defaultErrors
    },
    {
      code: '<Link target="_blank" href={ dynamicLink }></Link>',
      output: '<Link target="_blank" href={ dynamicLink } rel="noreferrer"></Link>',
      options: [{enforceDynamicLinks: 'always'}],
      settings: {linkComponents: ['Link']},
      errors: defaultErrors
    },
    {
      code: '<Link target="_blank" to={ dynamicLink }></Link>',
      output: '<Link target="_blank" to={ dynamicLink } rel="noreferrer"></Link>',
      options: [{enforceDynamicLinks: 'always'}],
      settings: {linkComponents: {name: 'Link', linkAttribute: 'to'}},
      errors: defaultErrors
    }
  ]
});
