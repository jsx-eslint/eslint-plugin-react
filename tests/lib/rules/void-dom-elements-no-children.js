/**
 * @fileoverview Tests for void-dom-elements-no-children
 * @author Joe Lencioni
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/void-dom-elements-no-children');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

function errorMessage(elementName) {
  return `Void DOM element <${elementName} /> cannot receive children.`;
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('void-dom-elements-no-children', rule, {
  valid: [
    {
      code: '<div>Foo</div>;'
    },
    {
      code: '<div children="Foo" />;'
    },
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "Foo" }} />;'
    },
    {
      code: 'React.createElement("div", {}, "Foo");'
    },
    {
      code: 'React.createElement("div", { children: "Foo" });'
    },
    {
      code: 'React.createElement("div", { dangerouslySetInnerHTML: { __html: "Foo" } });'
    },
    {
      code: 'document.createElement("img");'
    },
    {
      code: 'React.createElement("img");'
    }, {
      code: `
        const props = {};
        React.createElement("img", props);
      `
    }, {
      code: `
        import React, {createElement} from "react";
        createElement("div");
      `
    }, {
      code: `
        import React, {createElement} from "react";
        createElement("img");
      `
    }, {
      code: `
        import React, {createElement, PureComponent} from "react";
        class Button extends PureComponent {
          handleClick(ev) {
            ev.preventDefault();
          }
          render() {
            return <div onClick={this.handleClick}>Hello</div>;
          }
        }
      `
    }
  ],
  invalid: [
    {
      code: '<br>Foo</br>;',
      errors: [{message: errorMessage('br')}]
    },
    {
      code: '<br children="Foo" />;',
      errors: [{message: errorMessage('br')}]
    },
    {
      code: '<img {...props} children="Foo" />;',
      errors: [{message: errorMessage('img')}]
    },
    {
      code: '<br dangerouslySetInnerHTML={{ __html: "Foo" }} />;',
      errors: [{message: errorMessage('br')}]
    },
    {
      code: 'React.createElement("br", {}, "Foo");',
      errors: [{message: errorMessage('br')}]
    },
    {
      code: 'React.createElement("br", { children: "Foo" });',
      errors: [{message: errorMessage('br')}]
    },
    {
      code: 'React.createElement("br", { dangerouslySetInnerHTML: { __html: "Foo" } });',
      errors: [{message: errorMessage('br')}]
    },
    {
      code: `
        import React, {createElement} from "react";
        createElement("img", {}, "Foo");
      `,
      errors: [{message: errorMessage('img')}],
      parser: 'babel-eslint'
    },
    {
      code: `
        import React, {createElement} from "react";
        createElement("img", { children: "Foo" });
      `,
      errors: [{message: errorMessage('img')}],
      parser: 'babel-eslint'
    },
    {
      code: `
        import React, {createElement} from "react";
        createElement("img", { dangerouslySetInnerHTML: { __html: "Foo" } });
      `,
      errors: [{message: errorMessage('img')}],
      parser: 'babel-eslint'
    }
  ]
});
