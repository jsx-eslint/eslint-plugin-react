/**
 * @fileoverview Enforce React components to have a shouldComponentUpdate method
 * @author Evgueni Naverniouk
 */
'use strict';

const rule = require('../../../lib/rules/require-optimization');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

const MESSAGE = 'Component is not optimized. Please add a shouldComponentUpdate method.';

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('react-require-optimization', rule, {
  valid: [{
    code: [
      'class A {}'
    ].join('\n')
  }, {
    code: [
      'import React from "react";' +
      'class YourComponent extends React.Component {' +
      'shouldComponentUpdate () {}' +
      '}'
    ].join('\n')
  }, {
    code: [
      'import React, {Component} from "react";' +
      'class YourComponent extends Component {' +
      'shouldComponentUpdate () {}' +
      '}'
    ].join('\n')
  }, {
    code: [
      'import React, {Component} from "react";',
      '@reactMixin.decorate(PureRenderMixin)',
      'class YourComponent extends Component {',
      '  componetnDidMount () {}',
      '  render() {}',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'import React from "react";' +
      'createReactClass({' +
      'shouldComponentUpdate: function () {}' +
      '})'
    ].join('\n')
  }, {
    code: [
      'import React from "react";' +
      'createReactClass({' +
      'mixins: [PureRenderMixin]' +
      '})'
    ].join('\n')
  }, {
    code: [
      '@reactMixin.decorate(PureRenderMixin)',
      'class DecoratedComponent extends Component {' +
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'const FunctionalComponent = function (props) {' +
      'return <div />;' +
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'function FunctionalComponent(props) {' +
      'return <div />;' +
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'const FunctionalComponent = (props) => {' +
      'return <div />;' +
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      '@bar',
      '@pureRender',
      '@foo',
      'class DecoratedComponent extends Component {' +
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}]
  }, {
    code: [
      'import React from "react";' +
      'class YourComponent extends React.PureComponent {}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}]
  }, {
    code: [
      'import React, {PureComponent} from "react";' +
      'class YourComponent extends PureComponent {}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}]
  }],

  invalid: [{
    code: [
      'import React from "react";' +
      'class YourComponent extends React.Component {}'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: [
      'import React from "react";',
      'class YourComponent extends React.Component {',
      '  handleClick() {}',
      '  render() {',
      '    return <div onClick={this.handleClick}>123</div>',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: [
      'import React, {Component} from "react";' +
      'class YourComponent extends Component {}'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: [
      'import React from "react";' +
      'createReactClass({' +
      '})'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: [
      'import React from "react";' +
      'createReactClass({' +
      'mixins: [RandomMixin]' +
      '})'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: [
      '@reactMixin.decorate(SomeOtherMixin)',
      'class DecoratedComponent extends Component {' +
      '}'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      '@bar',
      '@pure',
      '@foo',
      'class DecoratedComponent extends Component {' +
      '}'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }],
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}]
  }]
});
