/**
 * @fileoverview Report usages of class methods besides render returning JSX
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/prefer-separate-components');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('prefer-separate-components', rule, {
  valid: [{
    code: `
      class Foo extends React.Component {
        render() {
          return <div>foo</div>;
        }
      }
    `
  }, {
    code: `
      class Foo extends React.Component {
        render() {
          return React.createElement('div', null, 'foo');
        }
      }
    `
  }, {
    code: `
      createReactClass({
        render() {
          return <div>foo</div>;
        }
      });
    `
  }, {
    code: `
      createReactClass({
        render() {
          return React.createElement('div', null, 'foo');
        }
      });
    `
  }],
  invalid: [{
    code: `
      class Foo extends React.Component {
        renderBar() {
          return <span>bar</span>;
        }
        render() {
          return (
            <div>
              foo
              {this.renderBar()}
            </div>
          );
        }
      }
    `,
    errors: 1
  }, {
    code: `
      class Foo extends React.Component {
        renderBar() {
          return React.createElement('span', null, 'bar');
        }
        render() {
          return React.createElement(
            'div',
            null,
            'foo',
            this.renderBar()
          );
        }
      }
    `,
    errors: 1
  }, {
    code: `
      class Foo extends React.Component {
        renderBars() {
          const bars = ['bar', 'bar', 'bar'];
          return bars.map((bar) => <span>{bar}</span>);
        }
        render() {
          return (
            <div>
              foo
              {this.renderBars()}
            </div>
          );
        }
      }
    `,
    errors: 1
  }, {
    code: `
      class Foo extends React.Component {
        renderBars() {
          const bars = ['bar', 'bar', 'bar'];
          return bars.map((bar) => React.createElement('span', null, bar));
        }
        render() {
          return React.createElement(
            'div',
            null,
            'foo',
            this.renderBars()
          );
        }
      }
    `,
    errors: 1
  }, {
    code: `
      createReactClass({
        renderBars() {
          const bars = ['bar', 'bar', 'bar'];
          return bars.map((bar) => <span>{bar}</span>);
        },
        render() {
          return (
            <div>
              foo
              {this.renderBars()}
            </div>
          );
        }
      });
    `,
    errors: 1
  }, {
    code: `
      createReactClass({
        renderBars() {
          const bars = ['bar', 'bar', 'bar'];
          return bars.map((bar) => React.createElement('span', null, bar));
        },
        render() {
          return React.createElement(
            'div',
            null,
            'foo',
            this.renderBars()
          );
        }
      });
    `,
    errors: 1
  }, {
    code: `
      createReactClass({
        renderBar() {
          return <span>bar</span>;
        },
        render() {
          return (
            <div>
              foo
              {this.renderBar()}
            </div>
          );
        }
      });
    `,
    errors: 1
  }, {
    code: `
      createReactClass({
        renderBar() {
          return React.createElement('span', null, 'bar');
        },
        render() {
          return React.createElement(
            'div',
            null,
            'foo',
            this.renderBar()
          );
        }
      });
    `,
    errors: 1
  }]
});
