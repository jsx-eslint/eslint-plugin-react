/**
 * @fileoverview Enforce React components to have a shouldComponentUpdate method
 * @author Evgueni Naverniouk
 */

'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/require-optimization');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('react-require-optimization', rule, {
  valid: parsers.all([
    {
      code: `
        class A {}
      `,
    },
    {
      code: `
        import React from "react";
        class YourComponent extends React.Component {
          shouldComponentUpdate () {}
        }
      `,
    },
    {
      code: `
        import React, {Component} from "react";
        class YourComponent extends Component {
          shouldComponentUpdate () {}
        }
      `,
    },
    {
      code: `
        import React, {Component} from "react";
        @reactMixin.decorate(PureRenderMixin)
        class YourComponent extends Component {
          componetnDidMount () {}
          render() {}
        }
      `,
      features: ['decorators'],
    },
    {
      code: `
        import React from "react";
        createReactClass({
          shouldComponentUpdate: function () {}
        })
      `,
    },
    {
      code: `
        import React from "react";
        createReactClass({
          mixins: [PureRenderMixin]
        })
      `,
    },
    {
      code: `
        @reactMixin.decorate(PureRenderMixin)
        class DecoratedComponent extends Component {}
      `,
      features: ['decorators'],
    },
    {
      code: `
        const FunctionalComponent = function (props) {
          return <div />;
        }
      `,
    },
    {
      code: `
        function FunctionalComponent(props) {
          return <div />;
        }
      `,
    },
    {
      code: `
        const FunctionalComponent = (props) => {
          return <div />;
        }
      `,
    },
    {
      code: `
        @bar
        @pureRender
        @foo
        class DecoratedComponent extends Component {}
      `,
      features: ['decorators'],
      options: [{ allowDecorators: ['renderPure', 'pureRender'] }],
    },
    {
      code: `
        import React from "react";
        class YourComponent extends React.PureComponent {}
      `,
      options: [{ allowDecorators: ['renderPure', 'pureRender'] }],
    },
    {
      code: `
        import React, {PureComponent} from "react";
        class YourComponent extends PureComponent {}
      `,
      options: [{ allowDecorators: ['renderPure', 'pureRender'] }],
    },
    {
      code: `
        const obj = { prop: [,,,,,] }
      `,
    },
    {
      code: `
        import React from "react";
        class YourComponent extends React.Component {
          handleClick = () => {}
          shouldComponentUpdate(){
            return true;
          }
          render() {
            return <div onClick={this.handleClick}>123</div>
          }
        }
      `,
      features: ['class fields'],
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        import React from "react";
        class YourComponent extends React.Component {}
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
    {
      code: `
        import React from "react";
        class YourComponent extends React.Component {
          handleClick() {}
          render() {
            return <div onClick={this.handleClick}>123</div>
          }
        }
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
    {
      code: `
        import React from "react";
        class YourComponent extends React.Component {
          handleClick = () => {}
          render() {
            return <div onClick={this.handleClick}>123</div>
          }
        }
      `,
      features: ['class fields'],
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
    {
      code: `
        import React, {Component} from "react";
        class YourComponent extends Component {}
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
    {
      code: `
        import React from "react";
        createReactClass({})
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
    {
      code: `
        import React from "react";
        createReactClass({
          mixins: [RandomMixin]
        })
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
    {
      code: `
        @reactMixin.decorate(SomeOtherMixin)
        class DecoratedComponent extends Component {}
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
      features: ['decorators'],
    },
    {
      code: `
        @bar
        @pure
        @foo
        class DecoratedComponent extends Component {}
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
      features: ['decorators'],
      options: [{ allowDecorators: ['renderPure', 'pureRender'] }],
    },
  ]),
});
