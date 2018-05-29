/**
 * @fileoverview Tests for jsx-no-undef
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const eslint = require('eslint');
const rule = require('../../../lib/rules/jsx-no-undef');
const RuleTester = eslint.RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
const linter = ruleTester.linter || eslint.linter;
linter.defineRule('no-undef', require('eslint/lib/rules/no-undef'));
ruleTester.run('jsx-no-undef', rule, {
  valid: [{
    code: '/*eslint no-undef:1*/ var React, App; React.render(<App />);'
  }, {
    code: '/*eslint no-undef:1*/ var React, App; React.render(<App />);'
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<img />);'
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<x-gif />);'
  }, {
    code: '/*eslint no-undef:1*/ var React, app; React.render(<app.Foo />);'
  }, {
    code: '/*eslint no-undef:1*/ var React, app; React.render(<app.foo.Bar />);'
  }, {
    code: `
      /*eslint no-undef:1*/
      var React;
      class Hello extends React.Component {
        render() {
          return <this.props.tag />
        }
      }
    `
  }, {
    code: 'var React; React.render(<Text />);',
    globals: {
      Text: true
    }
  }, {
    code: `
      import Text from "cool-module";
      const TextWrapper = function (props) {
        return (
          <Text />
        );
      };
    `,
    parserOptions: Object.assign({sourceType: 'module'}, parserOptions),
    options: [{
      allowGlobals: false
    }],
    parser: 'babel-eslint'
  }],
  invalid: [{
    code: '/*eslint no-undef:1*/ var React; React.render(<App />);',
    errors: [{
      message: '\'App\' is not defined.'
    }]
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<Appp.Foo />);',
    errors: [{
      message: '\'Appp\' is not defined.'
    }]
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<Apppp:Foo />);',
    errors: [{
      message: '\'Apppp\' is not defined.'
    }]
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<appp.Foo />);',
    errors: [{
      message: '\'appp\' is not defined.'
    }]
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<appp.foo.Bar />);',
    errors: [{
      message: '\'appp\' is not defined.'
    }]
  }, {
    code: `
      const TextWrapper = function (props) {
        return (
          <Text />
        );
      };
      export default TextWrapper;
    `,
    parserOptions: Object.assign({sourceType: 'module'}, parserOptions),
    errors: [{
      message: '\'Text\' is not defined.'
    }],
    options: [{
      allowGlobals: false
    }],
    parser: 'babel-eslint',
    globals: {
      Text: true
    }
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<Foo />);',
    errors: [{
      message: '\'Foo\' is not defined.'
    }]
  }]
});
