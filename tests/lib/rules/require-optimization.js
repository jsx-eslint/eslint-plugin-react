/**
 * @fileoverview Enforce React components to have a shouldComponentUpdate method
 * @author Evgueni Naverniouk
 */
'use strict';

var rule = require('../../../lib/rules/require-optimization');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module'
};

var MESSAGE = 'Component is not optimized. Please add a shouldComponentUpdate method.';

var ruleTester = new RuleTester();
ruleTester.run('react-require-optimization', rule, {
  valid: [{
    code: [
      'class A {}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'import React from "react";' +
      'class YourComponent extends React.Component {' +
      'shouldComponentUpdate () {}' +
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'import React, {Component} from "react";' +
      'class YourComponent extends Component {' +
      'shouldComponentUpdate () {}' +
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'import React from "react";' +
      'React.createClass({' +
      'shouldComponentUpdate: function () {}' +
      '})'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'import React from "react";' +
      'React.createClass({' +
      'mixins: [PureRenderMixin]' +
      '})'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '@reactMixin.decorate(PureRenderMixin)',
      'class DecoratedComponent extends Component {' +
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      'import React from "react";' +
      'class YourComponent extends React.Component {}'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'import React, {Component} from "react";' +
      'class YourComponent extends Component {}'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'import React from "react";' +
      'React.createClass({' +
      '})'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'import React from "react";' +
      'React.createClass({' +
      'mixins: [RandomMixin]' +
      '})'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }],
    parserOptions: parserOptions
  }, {
    code: [
      '@reactMixin.decorate(SomeOtherMixin)',
      'class DecoratedComponent extends Component {' +
      '}'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }],
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }]
});
