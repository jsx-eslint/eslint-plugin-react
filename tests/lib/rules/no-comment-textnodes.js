/**
 * @fileoverview Tests for no-comment-textnodes
 * @author Ben Vinegar
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-comment-textnodes');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-needs-i18n', rule, {

  valid: [
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        {/* valid */}',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint'
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (<div>{/* valid */}</div>);',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint'
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    const bar = (<div>{/* valid */}</div>);',
        '    return bar;',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint'
    }, {
      code: [
        'var Hello = React.createClass({',
        '  foo: (<div>{/* valid */}</div>),',
        '  render() {',
        '    return this.foo;',
        '  },',
        '});'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint'
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        {/* valid */}',
        '        {/* valid 2 */}',
        '        {/* valid 3 */}',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint'
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint'
    }, {
      code: [
        'var foo = require(\'foo\');'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint'
    }, {
      code: [
        '<Foo bar=\'test\'>',
        '  {/* valid */}',
        '</Foo>'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint'
    },

    // inside element declarations
    {
      code: [
        '<Foo /* valid */ placeholder={\'foo\'}/>'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint'
    },
    {
      code: [
        '<Foo title={\'foo\' /* valid */}/>'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (<div>// invalid</div>);',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (<div>/* invalid */</div>);',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        // invalid',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        asdjfl',
        '        /* invalid */',
        '        foo',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        {\'asdjfl\'}',
        '        // invalid',
        '        {\'foo\'}',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }
  ]
});
