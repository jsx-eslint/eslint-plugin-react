/**
 * @fileoverview Enforce React components to have a shouldComponentUpdate method
 * @author Evgueni Naverniouk
 */
'use strict';

const rule = require('../../../lib/rules/require-optimization');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const MESSAGE = 'Component is not optimized. Please add a shouldComponentUpdate method.';

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('react-require-optimization', rule, {
  valid: [{
    code: `
      class A {}
    `
  }, {
    code: `
      import React from "react";
      class YourComponent extends React.Component {
        shouldComponentUpdate () {}
      }
    `
  }, {
    code: `
      import React, {Component} from "react";
      class YourComponent extends Component {
        shouldComponentUpdate () {}
      }
    `
  }, {
    code: `
      import React, {Component} from "react";
      @reactMixin.decorate(PureRenderMixin)
      class YourComponent extends Component {
        componetnDidMount () {}
        render() {}
      }
    `,
    parser: 'babel-eslint'
  }, {
    code: `
      import React from "react";
      createReactClass({
        shouldComponentUpdate: function () {}
      })
    `
  }, {
    code: `
      import React from "react";
      createReactClass({
        mixins: [PureRenderMixin]
      })
    `
  }, {
    code: `
      @reactMixin.decorate(PureRenderMixin)
      class DecoratedComponent extends Component {}
    `,
    parser: 'babel-eslint'
  }, {
    code: `
      const FunctionalComponent = function (props) {
        return <div />;
      }
    `,
    parser: 'babel-eslint'
  }, {
    code: `
      function FunctionalComponent(props) {
        return <div />;
      }
    `,
    parser: 'babel-eslint'
  }, {
    code: `
      const FunctionalComponent = (props) => {
        return <div />;
      }
    `,
    parser: 'babel-eslint'
  }, {
    code: `
      @bar
      @pureRender
      @foo
      class DecoratedComponent extends Component {}
    `,
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}]
  }, {
    code: `
      import React from "react";
      class YourComponent extends React.PureComponent {}
    `,
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}]
  }, {
    code: `
      import React, {PureComponent} from "react";
      class YourComponent extends PureComponent {}
    `,
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}]
  }, {
    code: `
      const obj = { prop: [,,,,,] }
    `
  }],

  invalid: [{
    code: `
      import React from "react";
      class YourComponent extends React.Component {}
    `,
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: `
      import React from "react";
      class YourComponent extends React.Component {
        handleClick() {}
        render() {
          return <div onClick={this.handleClick}>123</div>
        }
      }
    `,
    parser: 'babel-eslint',
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: `
      import React, {Component} from "react";
      class YourComponent extends Component {}
    `,
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: `
      import React from "react";
      createReactClass({})
    `,
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: `
      import React from "react";
      createReactClass({
        mixins: [RandomMixin]
      })
    `,
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: `
      @reactMixin.decorate(SomeOtherMixin)
      class DecoratedComponent extends Component {}
    `,
    errors: [{
      message: MESSAGE
    }],
    parser: 'babel-eslint'
  }, {
    code: `
      @bar
      @pure
      @foo
      class DecoratedComponent extends Component {}
    `,
    errors: [{
      message: MESSAGE
    }],
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}]
  }]
});
