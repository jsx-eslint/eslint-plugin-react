/**
 * @fileoverview Tests for no-unknown-property
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-unknown-property');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-unknown-property', rule, {
  valid: parsers.all([
    { code: '<App class="bar" />;' },
    { code: '<App for="bar" />;' },
    { code: '<Foo.bar for="bar" />;' },
    { code: '<App accept-charset="bar" />;' },
    { code: '<meta charset="utf-8" />;' },
    { code: '<meta charSet="utf-8" />;' },
    { code: '<App http-equiv="bar" />;' },
    {
      code: '<App xlink:href="bar" />;',
      features: ['jsx namespace'],
    },
    { code: '<App clip-path="bar" />;' },
    { code: '<div className="bar"></div>;' },
    { code: '<div onMouseDown={this._onMouseDown}></div>;' },
    { code: '<div data-foo="bar"></div>;' },
    { code: '<div class="foo" is="my-elem"></div>;' },
    { code: '<div {...this.props} class="foo" is="my-elem"></div>;' },
    { code: '<atom-panel class="foo"></atom-panel>;' }, {
      code: '<div class="bar"></div>;',
      options: [{ ignore: ['class'] }],
    },
    { code: '<script crossOrigin />' },
    { code: '<audio crossOrigin />' },
    { code: '<div hasOwnProperty="should not be allowed tag" />' },
  ]),
  invalid: parsers.all([
    {
      code: '<div class="bar"></div>;',
      output: '<div className="bar"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'class',
            standardName: 'className',
          },
        },
      ],
    },
    {
      code: '<div for="bar"></div>;',
      output: '<div htmlFor="bar"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'for',
            standardName: 'htmlFor',
          },
        },
      ],
    },
    {
      code: '<div accept-charset="bar"></div>;',
      output: '<div acceptCharset="bar"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'accept-charset',
            standardName: 'acceptCharset',
          },
        },
      ],
    },
    {
      code: '<div http-equiv="bar"></div>;',
      output: '<div httpEquiv="bar"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'http-equiv',
            standardName: 'httpEquiv',
          },
        },
      ],
    },
    {
      code: '<div accesskey="bar"></div>;',
      output: '<div accessKey="bar"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'accesskey',
            standardName: 'accessKey',
          },
        },
      ],
    },
    {
      code: '<div onclick="bar"></div>;',
      output: '<div onClick="bar"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'onclick',
            standardName: 'onClick',
          },
        },
      ],
    },
    {
      code: '<div onmousedown="bar"></div>;',
      output: '<div onMouseDown="bar"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'onmousedown',
            standardName: 'onMouseDown',
          },
        },
      ],
    },
    {
      code: '<div onMousedown="bar"></div>;',
      output: '<div onMouseDown="bar"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'onMousedown',
            standardName: 'onMouseDown',
          },
        },
      ],
    },
    {
      code: '<use xlink:href="bar" />;',
      output: '<use xlinkHref="bar" />;',
      features: ['jsx namespace'],
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'xlink:href',
            standardName: 'xlinkHref',
          },
        },
      ],
    },
    {
      code: '<rect clip-path="bar" />;',
      output: '<rect clipPath="bar" />;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'clip-path',
            standardName: 'clipPath',
          },
        },
      ],
    },
    {
      code: '<script crossorigin />',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'crossorigin',
            standardName: 'crossOrigin',
          },
        },
      ],
      output: '<script crossOrigin />',
    },
    {
      code: '<div crossorigin />',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'crossorigin',
            standardName: 'crossOrigin',
          },
        },
      ],
      output: '<div crossOrigin />',
    },
    {
      code: '<div crossOrigin />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'crossOrigin',
            tagName: 'div',
            allowedTags: 'script, img, video, audio, link',
          },
        },
      ],
    },
  ]),
});
