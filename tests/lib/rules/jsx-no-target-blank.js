/**
 * @fileoverview Forbid target='_blank' attribute
 * @author Kevin Miller
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/jsx-no-target-blank');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
const defaultErrors = [{ messageId: 'noTargetBlankWithoutNoreferrer' }];
const allowReferrerErrors = [{ messageId: 'noTargetBlankWithoutNoopener' }];

ruleTester.run('jsx-no-target-blank', rule, {
  valid: parsers.all([
    { code: '<a href="foobar"></a>' },
    { code: '<a randomTag></a>' },
    { code: '<a target />' },
    { code: '<a href="foobar" target="_blank" rel="noopener noreferrer"></a>' },
    { code: '<a href="foobar" target="_blank" rel="noreferrer"></a>' },
    { code: '<a href="foobar" target="_blank" rel={"noopener noreferrer"}></a>' },
    { code: '<a href="foobar" target="_blank" rel={"noreferrer"}></a>' },
    { code: '<a href={"foobar"} target={"_blank"} rel={"noopener noreferrer"}></a>' },
    { code: '<a href={"foobar"} target={"_blank"} rel={"noreferrer"}></a>' },
    { code: '<a href={\'foobar\'} target={\'_blank\'} rel={\'noopener noreferrer\'}></a>' },
    { code: '<a href={\'foobar\'} target={\'_blank\'} rel={\'noreferrer\'}></a>' },
    { code: '<a href={`foobar`} target={`_blank`} rel={`noopener noreferrer`}></a>' },
    { code: '<a href={`foobar`} target={`_blank`} rel={`noreferrer`}></a>' },
    { code: '<a target="_blank" {...spreadProps} rel="noopener noreferrer"></a>' },
    { code: '<a target="_blank" {...spreadProps} rel="noreferrer"></a>' },
    { code: '<a {...spreadProps} target="_blank" rel="noopener noreferrer" href="https://example.com">s</a>' },
    { code: '<a {...spreadProps} target="_blank" rel="noreferrer" href="https://example.com">s</a>' },
    { code: '<a target="_blank" rel="noopener noreferrer" {...spreadProps}></a>' },
    { code: '<a target="_blank" rel="noreferrer" {...spreadProps}></a>' },
    { code: '<p target="_blank"></p>' },
    { code: '<a href="foobar" target="_BLANK" rel="NOOPENER noreferrer"></a>' },
    { code: '<a href="foobar" target="_BLANK" rel="NOREFERRER"></a>' },
    { code: '<a target="_blank" rel={relValue}></a>' },
    { code: '<a target={targetValue} rel="noopener noreferrer"></a>' },
    { code: '<a target={targetValue} rel="noreferrer"></a>' },
    { code: '<a target={targetValue} rel={"noopener noreferrer"}></a>' },
    { code: '<a target={targetValue} rel={"noreferrer"}></a>' },
    { code: '<a target={targetValue} href="relative/path"></a>' },
    { code: '<a target={targetValue} href="/absolute/path"></a>' },
    { code: '<a target={\'targetValue\'} href="/absolute/path"></a>' },
    { code: '<a target={"targetValue"} href="/absolute/path"></a>' },
    { code: '<a target={null} href="//example.com"></a>' },
    {
      code: '<a {...someObject} href="/absolute/path"></a>',
      options: [{ enforceDynamicLinks: 'always', warnOnSpreadAttributes: true }],
    },
    {
      code: '<a {...someObject} rel="noreferrer"></a>',
      options: [{ enforceDynamicLinks: 'always', warnOnSpreadAttributes: true }],
    },
    {
      code: '<a {...someObject} rel="noreferrer" target="_blank"></a>',
      options: [{ enforceDynamicLinks: 'always', warnOnSpreadAttributes: true }],
    },
    {
      code: '<a {...someObject} href="foobar" target="_blank"></a>',
      options: [{ enforceDynamicLinks: 'always', warnOnSpreadAttributes: true }],
    },
    {
      code: '<a target="_blank" href={ dynamicLink }></a>',
      options: [{ enforceDynamicLinks: 'never' }],
    },
    {
      code: '<a target={"_blank"} href={ dynamicLink }></a>',
      options: [{ enforceDynamicLinks: 'never' }],
    },
    {
      code: '<a target={\'_blank\'} href={ dynamicLink }></a>',
      options: [{ enforceDynamicLinks: 'never' }],
    },
    {
      code: '<Link target="_blank" href={ dynamicLink }></Link>',
      options: [{ enforceDynamicLinks: 'never' }],
      settings: { linkComponents: ['Link'] },
    },
    {
      code: '<Link target="_blank" to={ dynamicLink }></Link>',
      options: [{ enforceDynamicLinks: 'never' }],
      settings: { linkComponents: { name: 'Link', linkAttribute: 'to' } },
    },
    {
      code: '<Link target="_blank" to={ dynamicLink }></Link>',
      options: [{ enforceDynamicLinks: 'never' }],
      settings: { linkComponents: { name: 'Link', linkAttribute: ['to'] } },
    },
    {
      code: '<a href="foobar" target="_blank" rel="noopener"></a>',
      options: [{ allowReferrer: true }],
    },
    {
      code: '<a href="foobar" target="_blank" rel="noreferrer"></a>',
      options: [{ allowReferrer: true }],
    },
    {
      code: '<a target={3} />',
    },
    {
      code: '<a href="some-link" {...otherProps} target="some-non-blank-target"></a>',
    },
    {
      code: '<a href="some-link" target="some-non-blank-target" {...otherProps}></a>',
    },
    {
      code: '<a target="_blank" href="/absolute/path"></a>',
      options: [{ forms: false }],
    },
    {
      code: '<a target="_blank" href="/absolute/path"></a>',
      options: [{ forms: false, links: true }],
    },
    {
      code: '<form action="https://example.com" target="_blank"></form>',
      options: [],
    },
    {
      code: '<form action="https://example.com" target="_blank" rel="noopener noreferrer"></form>',
      options: [{ forms: true }],
    },
    {
      code: '<form action="https://example.com" target="_blank" rel="noopener noreferrer"></form>',
      options: [{ forms: true, links: false }],
    },
    {
      code: '<a href target="_blank"/>',
    },
    {
      code: '<a href={href} target={isExternal ? "_blank" : undefined} rel="noopener noreferrer" />',
    },
    {
      code: '<a href={href} target={isExternal ? undefined : "_blank"} rel={isExternal ? "noreferrer" : "noopener noreferrer"} />',
    },
    {
      code: '<a href={href} target={isExternal ? undefined : "_blank"} rel={isExternal ? "noreferrer noopener" : "noreferrer"} />',
    },
    {
      code: '<a href={href} target="_blank" rel={isExternal ? "noreferrer" : "noopener"} />',
      options: [{ allowReferrer: true }],
    },
    {
      code: '<a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined} />',
    },
    {
      code: '<a href={href} target={isSelf ? "_self" : "_blank"} rel={isSelf ? undefined : "noreferrer"} />',
    },
    {
      code: '<a href={href} target={isSelf ? "_self" : ""} rel={isSelf ? undefined : ""} />',
    },
    {
      code: '<a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} />',
    },
    {
      code: '<form action={action} />',
      options: [{ forms: true }],
    },
    {
      code: '<form action={action} {...spread} />',
      options: [{ forms: true }],
    },
  ]),
  invalid: parsers.all([
    {
      code: '<a target="_blank" href="https://example.com/1"></a>',
      output: '<a target="_blank" href="https://example.com/1" rel="noreferrer"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" rel="" href="https://example.com/2"></a>',
      output: '<a target="_blank" rel="noreferrer" href="https://example.com/2"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" rel={0} href="https://example.com/3"></a>',
      output: '<a target="_blank" rel="noreferrer" href="https://example.com/3"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" rel={1} href="https://example.com/3"></a>',
      output: '<a target="_blank" rel="noreferrer" href="https://example.com/3"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" rel={false} href="https://example.com/4"></a>',
      output: '<a target="_blank" rel="noreferrer" href="https://example.com/4"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" rel={null} href="https://example.com/5"></a>',
      output: '<a target="_blank" rel="noreferrer" href="https://example.com/5"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" rel="noopenernoreferrer" href="https://example.com/6"></a>',
      output: '<a target="_blank" rel="noopener noreferrer" href="https://example.com/6"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" rel="no referrer" href="https://example.com/7"></a>',
      output: '<a target="_blank" rel="no referrer noreferrer" href="https://example.com/7"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_BLANK" href="https://example.com/8"></a>',
      output: '<a target="_BLANK" href="https://example.com/8" rel="noreferrer"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" href="//example.com/9"></a>',
      output: '<a target="_blank" href="//example.com/9" rel="noreferrer"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" href="//example.com/10" rel={true}></a>',
      output: '<a target="_blank" href="//example.com/10" rel="noreferrer"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" href="//example.com/11" rel={3}></a>',
      output: '<a target="_blank" href="//example.com/11" rel="noreferrer"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" href="//example.com/12" rel={null}></a>',
      output: '<a target="_blank" href="//example.com/12" rel="noreferrer"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" href="//example.com/13" rel={getRel()}></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" href="//example.com/14" rel={"noopenernoreferrer"}></a>',
      output: '<a target="_blank" href="//example.com/14" rel={"noopener noreferrer"}></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target={"_blank"} href={"//example.com/15"} rel={"noopenernoreferrer"}></a>',
      output: '<a target={"_blank"} href={"//example.com/15"} rel={"noopener noreferrer"}></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target={"_blank"} href={"//example.com/16"} rel={"noopenernoreferrernoreferrernoreferrernoreferrernoreferrer"}></a>',
      output: '<a target={"_blank"} href={"//example.com/16"} rel={"noopener noreferrer"}></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" href="//example.com/17" rel></a>',
      output: '<a target="_blank" href="//example.com/17" rel="noreferrer"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" href={ dynamicLink }></a>',
      output: '<a target="_blank" href={ dynamicLink } rel="noreferrer"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target={\'_blank\'} href="//example.com/18"></a>',
      output: '<a target={\'_blank\'} href="//example.com/18" rel="noreferrer"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a target={"_blank"} href="//example.com/19"></a>',
      output: '<a target={"_blank"} href="//example.com/19" rel="noreferrer"></a>',
      errors: defaultErrors,
    },
    {
      code: '<a href="https://example.com/20" target="_blank" rel></a>',
      output: '<a href="https://example.com/20" target="_blank" rel="noopener"></a>',
      options: [{ allowReferrer: true }],
      errors: allowReferrerErrors,
    },
    {
      code: '<a href="https://example.com/20" target="_blank"></a>',
      output: '<a href="https://example.com/20" target="_blank" rel="noopener"></a>',
      options: [{ allowReferrer: true }],
      errors: allowReferrerErrors,
    },
    {
      code: '<a target="_blank" href={ dynamicLink }></a>',
      output: '<a target="_blank" href={ dynamicLink } rel="noreferrer"></a>',
      options: [{ enforceDynamicLinks: 'always' }],
      errors: defaultErrors,
    },
    {
      code: '<a {...someObject}></a>',
      options: [{ enforceDynamicLinks: 'always', warnOnSpreadAttributes: true }],
      errors: defaultErrors,
    },
    {
      code: '<a {...someObject} target="_blank"></a>',
      options: [{ enforceDynamicLinks: 'always', warnOnSpreadAttributes: true }],
      errors: defaultErrors,
    },
    {
      code: '<a href="foobar" {...someObject} target="_blank"></a>',
      options: [{ enforceDynamicLinks: 'always', warnOnSpreadAttributes: true }],
      errors: defaultErrors,
    },
    {
      code: '<a href="foobar" target="_blank" rel="noreferrer" {...someObject}></a>',
      options: [{ enforceDynamicLinks: 'always', warnOnSpreadAttributes: true }],
      errors: defaultErrors,
    },
    {
      code: '<a href="foobar" target="_blank" {...someObject}></a>',
      options: [{ enforceDynamicLinks: 'always', warnOnSpreadAttributes: true }],
      errors: defaultErrors,
    },
    {
      code: '<Link target="_blank" href={ dynamicLink }></Link>',
      output: '<Link target="_blank" href={ dynamicLink } rel="noreferrer"></Link>',
      options: [{ enforceDynamicLinks: 'always' }],
      settings: { linkComponents: ['Link'] },
      errors: defaultErrors,
    },
    {
      code: '<Link target="_blank" to={ dynamicLink }></Link>',
      output: '<Link target="_blank" to={ dynamicLink } rel="noreferrer"></Link>',
      options: [{ enforceDynamicLinks: 'always' }],
      settings: { linkComponents: { name: 'Link', linkAttribute: 'to' } },
      errors: defaultErrors,
    },
    {
      code: '<a href="some-link" {...otherProps} target="some-non-blank-target"></a>',
      errors: defaultErrors,
      options: [{ warnOnSpreadAttributes: true }],
    },
    {
      code: '<a href="some-link" target="some-non-blank-target" {...otherProps}></a>',
      errors: defaultErrors,
      options: [{ warnOnSpreadAttributes: true }],
    },
    {
      code: '<a target="_blank" href="//example.com" rel></a>',
      output: '<a target="_blank" href="//example.com" rel="noreferrer"></a>',
      options: [{ links: true }],
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" href="//example.com" rel></a>',
      output: '<a target="_blank" href="//example.com" rel="noreferrer"></a>',
      options: [{ links: true, forms: true }],
      errors: defaultErrors,
    },
    {
      code: '<a target="_blank" href="//example.com" rel></a>',
      output: '<a target="_blank" href="//example.com" rel="noreferrer"></a>',
      options: [{ links: true, forms: false }],
      errors: defaultErrors,
    },
    {
      code: '<form method="POST" action="https://example.com" target="_blank"></form>',
      options: [{ forms: true }],
      errors: defaultErrors,
    },
    {
      code: '<form method="POST" action="https://example.com" rel="" target="_blank"></form>',
      options: [{ forms: true }],
      errors: defaultErrors,
    },
    {
      code: '<form method="POST" action="https://example.com" rel="noopenernoreferrer" target="_blank"></form>',
      options: [{ forms: true }],
      errors: defaultErrors,
    },
    {
      code: '<form method="POST" action="https://example.com" rel="noopenernoreferrer" target="_blank"></form>',
      options: [{ forms: true, links: false }],
      errors: defaultErrors,
    },
    {
      code: '<a href={href} target="_blank" rel={isExternal ? "undefined" : "undefined"} />',
      errors: defaultErrors,
    },
    {
      code: '<a href={href} target="_blank" rel={isExternal ? "noopener" : undefined} />',
      errors: defaultErrors,
    },
    {
      code: '<a href={href} target="_blank" rel={isExternal ? "undefined" : "noopener"} />',
      errors: defaultErrors,
    },
    {
      code: '<a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? undefined : "noopener noreferrer"} />',
      errors: defaultErrors,
    },
    {
      code: '<a href={href} target="_blank" rel={isExternal ? 3 : "noopener noreferrer"} />',
      errors: defaultErrors,
    },
    {
      code: '<a href={href} target="_blank" rel={isExternal ? "noopener noreferrer" : "3"} />',
      errors: defaultErrors,
    },
    {
      code: '<a href={href} target="_blank" rel={isExternal ? "noopener" : "2"} />',
      options: [{ allowReferrer: true }],
      errors: allowReferrerErrors,
    },
    {
      code: '<form action={action} target="_blank" />',
      options: [{ allowReferrer: true, forms: true }],
      errors: allowReferrerErrors,
    },
    {
      code: '<form action={action} target="_blank" />',
      options: [{ forms: true }],
      errors: defaultErrors,
    },
    {
      code: '<form action={action} {...spread} />',
      options: [{ forms: true, warnOnSpreadAttributes: true }],
      errors: defaultErrors,
    },
  ]),
});
