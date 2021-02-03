/**
 * @fileoverview Tests for jsx-fragments
 * @author Alex Zherdev
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-fragments');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const settings = {
  react: {
    version: '16.2',
    pragma: 'Act',
    fragment: 'Frag'
  }
};

const settingsOld = {
  react: {
    version: '16.1',
    pragma: 'Act',
    fragment: 'Frag'
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-fragments', rule, {
  valid: [{
    code: '<><Foo /></>',
    parser: parsers.BABEL_ESLINT,
    settings
  }, {
    code: '<Act.Frag><Foo /></Act.Frag>',
    options: ['element'],
    settings
  }, {
    code: '<Act.Frag />',
    options: ['element'],
    settings
  }, {
    code: `
      import Act, { Frag as F } from 'react';
      <F><Foo /></F>;
    `,
    options: ['element'],
    settings
  }, {
    code: `
      const F = Act.Frag;
      <F><Foo /></F>;
    `,
    options: ['element'],
    settings
  }, {
    code: `
      const { Frag } = Act;
      <Frag><Foo /></Frag>;
    `,
    options: ['element'],
    settings
  }, {
    code: `
      const { Frag } = require('react');
      <Frag><Foo /></Frag>;
    `,
    options: ['element'],
    settings
  }, {
    code: '<Act.Frag key="key"><Foo /></Act.Frag>',
    options: ['syntax'],
    settings
  }, {
    code: '<Act.Frag key="key" />',
    options: ['syntax'],
    settings
  }],

  invalid: [{
    code: '<><Foo /></>',
    parser: parsers.BABEL_ESLINT,
    settings: settingsOld,
    errors: [{
      messageId: 'fragmentsNotSupported'
    }]
  }, {
    code: '<Act.Frag><Foo /></Act.Frag>',
    settings: settingsOld,
    errors: [{
      messageId: 'fragmentsNotSupported'
    }]
  }, {
    code: '<Act.Frag />',
    settings: settingsOld,
    errors: [{
      messageId: 'fragmentsNotSupported'
    }]
  }, {
    code: '<><Foo /></>',
    parser: parsers.BABEL_ESLINT,
    options: ['element'],
    settings,
    errors: [{
      messageId: 'preferPragma',
      data: {react: 'Act', fragment: 'Frag'}
    }],
    output: '<Act.Frag><Foo /></Act.Frag>'
  }, {
    code: '<Act.Frag><Foo /></Act.Frag>',
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {react: 'Act', fragment: 'Frag'}
    }],
    output: '<><Foo /></>'
  }, {
    code: '<Act.Frag />',
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {react: 'Act', fragment: 'Frag'}
    }],
    output: '<></>'
  }, {
    code: `
      import Act, { Frag as F } from 'react';
      <F />;
    `,
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {react: 'Act', fragment: 'Frag'}
    }],
    output: `
      import Act, { Frag as F } from 'react';
      <></>;
    `
  }, {
    code: `
      import Act, { Frag as F } from 'react';
      <F><Foo /></F>;
    `,
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {react: 'Act', fragment: 'Frag'}
    }],
    output: `
      import Act, { Frag as F } from 'react';
      <><Foo /></>;
    `
  }, {
    code: `
      import Act, { Frag } from 'react';
      <Frag><Foo /></Frag>;
    `,
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {react: 'Act', fragment: 'Frag'}
    }],
    output: `
      import Act, { Frag } from 'react';
      <><Foo /></>;
    `
  }, {
    code: `
      const F = Act.Frag;
      <F><Foo /></F>;
    `,
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {react: 'Act', fragment: 'Frag'}
    }],
    output: `
      const F = Act.Frag;
      <><Foo /></>;
    `
  }, {
    code: `
      const { Frag } = Act;
      <Frag><Foo /></Frag>;
    `,
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {react: 'Act', fragment: 'Frag'}
    }],
    output: `
      const { Frag } = Act;
      <><Foo /></>;
    `
  }, {
    code: `
      const { Frag } = require('react');
      <Frag><Foo /></Frag>;
    `,
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {react: 'Act', fragment: 'Frag'}
    }],
    output: `
      const { Frag } = require('react');
      <><Foo /></>;
    `
  }]
});
