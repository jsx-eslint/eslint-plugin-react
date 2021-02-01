/**
 * @fileoverview Tests for jsx-pascal-case
 * @author Jake Marsh
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-pascal-case');

const parsers = require('../../helpers/parsers');

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
ruleTester.run('jsx-pascal-case', rule, {
  valid: [{
    // The rule must not warn on components that start with a lowercase
    // because they are interpreted as HTML elements by React
    code: '<testcomponent />'
  }, {
    code: '<testComponent />'
  }, {
    code: '<test_component />'
  }, {
    code: '<TestComponent />'
  }, {
    code: '<CSSTransitionGroup />'
  }, {
    code: '<BetterThanCSS />'
  }, {
    code: '<TestComponent><div /></TestComponent>'
  }, {
    code: '<Test1Component />'
  }, {
    code: '<TestComponent1 />'
  }, {
    code: '<T3StComp0Nent />'
  }, {
    code: '<Éurströmming />'
  }, {
    code: '<Año />'
  }, {
    code: '<Søknad />'
  }, {
    code: '<T />'
  }, {
    code: '<T />',
    parser: parsers.BABEL_ESLINT
  }, {
    code: '<YMCA />',
    options: [{allowAllCaps: true}]
  }, {
    code: '<TEST_COMPONENT />',
    options: [{allowAllCaps: true}]
  }, {
    code: '<Modal.Header />'
  }, {
    code: '<qualification.T3StComp0Nent />'
  }, {
    code: '<Modal:Header />'
  }, {
    code: '<IGNORED />',
    options: [{ignore: ['IGNORED']}]
  }, {
    code: '<Foo_DEPRECATED />',
    options: [{ignore: ['*_D*D']}]
  }, {
    code: '<Foo_DEPRECATED />',
    options: [{ignore: ['*_+(DEPRECATED|IGNORED)']}]
  }, {
    code: '<$ />'
  }, {
    code: '<_ />'
  }, {
    code: '<H1>Hello!</H1>'
  }, {
    code: '<Typography.P />'
  }, {
    code: '<Styled.h1 />',
    options: [{allowNamespace: true}]
  }],

  invalid: [{
    code: '<Test_component />',
    errors: [{
      messageId: 'usePascalCase',
      data: {name: 'Test_component'}
    }]
  }, {
    code: '<TEST_COMPONENT />',
    errors: [{
      messageId: 'usePascalCase',
      data: {name: 'TEST_COMPONENT'}
    }]
  }, {
    code: '<YMCA />',
    errors: [{
      messageId: 'usePascalCase',
      data: {name: 'YMCA'}
    }]
  }, {
    code: '<_TEST_COMPONENT />',
    options: [{allowAllCaps: true}],
    errors: [{
      messageId: 'usePascalOrSnakeCase',
      data: {name: '_TEST_COMPONENT'}
    }]
  }, {
    code: '<TEST_COMPONENT_ />',
    options: [{allowAllCaps: true}],
    errors: [{
      messageId: 'usePascalOrSnakeCase',
      data: {name: 'TEST_COMPONENT_'}
    }]
  }, {
    code: '<__ />',
    options: [{allowAllCaps: true}],
    errors: [{
      messageId: 'usePascalOrSnakeCase',
      data: {name: '__'}
    }]
  }, {
    code: '<$a />',
    errors: [{
      messageId: 'usePascalCase',
      data: {name: '$a'}
    }]
  }, {
    code: '<Foo_DEPRECATED />',
    options: [{ignore: ['*_FOO']}],
    errors: [{
      messageId: 'usePascalCase',
      data: {name: 'Foo_DEPRECATED'}
    }]
  }, {
    code: '<Styled.h1 />',
    errors: [{
      messageId: 'usePascalCase',
      data: {name: 'h1'}
    }]
  }, {
    code: '<$Typography.P />',
    errors: [{
      messageId: 'usePascalCase',
      data: {name: '$Typography'}
    }]
  }, {
    code: '<STYLED.h1 />',
    options: [{allowNamespace: true}],
    errors: [{
      messageId: 'usePascalCase',
      data: {name: 'STYLED'}
    }]
  }]
});
