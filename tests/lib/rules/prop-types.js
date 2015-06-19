/**
 * @fileoverview Prevent missing props validation in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint-tester');

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('lib/rules/prop-types', {

  valid: [
    {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: React.PropTypes.string.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: React.PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>Hello World</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>Hello World {this.props.children}</div>;',
        '  }',
        '});'
      ].join('\n'),
      args: [1, {
        ignore: ['children']
      }],
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    var props = this.props;',
        '    return <div>Hello World</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    var propName = "foo";',
        '    return <div>Hello World {this.props[propName]}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: externalPropTypes,',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello World</div>;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: React.PropTypes.string',
        '};',
        'Hello.propTypes.lastname = React.PropTypes.string;'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: React.PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    var user = {',
        '      name: this.props.name',
        '    };',
        '    return <div>Hello {user.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'class Hello {',
        '  render() {',
        '    return \'Hello\' + this.props.name;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {',
        '    return {',
        '      name: React.PropTypes.string',
        '    };',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        destructuring: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { firstname, ...other } = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: React.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      ecmaFeatures: {
        classes: true,
        destructuring: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes = {',
        '    name: React.PropTypes.string',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      ecmaFeatures: {
        classes: true,
        destructuring: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  \'firstname\': React.PropTypes.string',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    if (this.props.hasOwnProperty(\'firstname\')) {',
        '      return <div>Hello {this.props.firstname}</div>;',
        '    }',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  \'firstname\': React.PropTypes.string',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {};',
        'Hello.propTypes.a = React.PropTypes.shape({',
        '  b: React.PropTypes.string',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.shape({',
        '    b: React.PropTypes.shape({',
        '    })',
        '  })',
        '};',
        'Hello.propTypes.a.b.c = React.PropTypes.number;'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    this.props.a.__.d.length;',
        '    this.props.a.anything.e[2];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.objectOf(',
        '    React.PropTypes.shape({',
        '      c: React.PropTypes.number,',
        '      d: React.PropTypes.string,',
        '      e: React.PropTypes.array',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var i = 3;',
        '    this.props.a[2].c;',
        '    this.props.a[i].d.length;',
        '    this.props.a[i + 2].e[2];',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.arrayOf(',
        '    React.PropTypes.shape({',
        '      c: React.PropTypes.number,',
        '      d: React.PropTypes.string,',
        '      e: React.PropTypes.array',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.c;',
        '    this.props.a[2] === true;',
        '    this.props.a.e[2];',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.oneOfType([',
        '    React.PropTypes.shape({',
        '      c: React.PropTypes.number,',
        '      e: React.PropTypes.array',
        '    }).isRequired,',
        '    React.PropTypes.arrayOf(',
        '      React.PropTypes.bool',
        '    )',
        '  ])',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.render;',
        '    this.props.a.c;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.instanceOf(Hello)',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.arr;',
        '    this.props.arr[3];',
        '    this.props.arr.length;',
        '    this.props.arr.push(3);',
        '    this.props.bo;',
        '    this.props.bo.toString();',
        '    this.props.fu;',
        '    this.props.fu.bind(this);',
        '    this.props.numb;',
        '    this.props.numb.toFixed();',
        '    this.props.stri;',
        '    this.props.stri.length();',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  arr: React.PropTypes.array,',
        '  bo: React.PropTypes.bool.isRequired,',
        '  fu: React.PropTypes.func,',
        '  numb: React.PropTypes.number,',
        '  stri: React.PropTypes.string',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { ',
        '      propX,',
        '      "aria-controls": ariaControls, ',
        '      ...props } = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "propX": React.PropTypes.string,',
        '  "aria-controls": React.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      },
      errors: [{
        message: '\'name\' is missing in props validation',
        line: 3,
        column: 34,
        type: 'Identifier'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'name\' is missing in props validation for Hello',
        line: 3,
        column: 34,
        type: 'Identifier'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: React.PropTypes.string',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'lastname\' is missing in props validation for Hello'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  name: React.PropTypes.string',
        '};',
        'class HelloBis extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'name\' is missing in props validation for HelloBis'
      }]
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: React.PropTypes.string.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name} and {this.props.propWithoutTypeDefinition}</div>;',
        '  }',
        '});',
        'var Hello2 = React.createClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      },
      errors: [{
        message: '\'propWithoutTypeDefinition\' is missing in props validation'
      }, {
        message: '\'name\' is missing in props validation'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { firstname, lastname } = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: React.PropTypes.string',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        destructuring: true,
        jsx: true
      },
      errors: [{
        message: '\'lastname\' is missing in props validation for Hello'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes: { ',
        '    firstname: React.PropTypes.string',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'firstname\' is missing in props validation for Hello'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.shape({',
        '  })',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'a.b\' is missing in props validation for Hello'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.shape({',
        '    b: React.PropTypes.shape({',
        '    })',
        '  })',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'a.b.c\' is missing in props validation for Hello'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    this.props.a.__.d.length;',
        '    this.props.a.anything.e[2];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.objectOf(',
        '    React.PropTypes.shape({',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [
        {message: '\'a.b.c\' is missing in props validation for Hello'},
        {message: '\'a.__.d\' is missing in props validation for Hello'},
        {message: '\'a.__.d.length\' is missing in props validation for Hello'},
        {message: '\'a.anything.e\' is missing in props validation for Hello'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var i = 3;',
        '    this.props.a[2].c;',
        '    this.props.a[i].d.length;',
        '    this.props.a[i + 2].e[2];',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.arrayOf(',
        '    React.PropTypes.shape({',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [
        {message: '\'a[].c\' is missing in props validation for Hello'},
        {message: '\'a[].d\' is missing in props validation for Hello'},
        {message: '\'a[].d.length\' is missing in props validation for Hello'},
        {message: '\'a[].e\' is missing in props validation for Hello'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.length;',
        '    this.props.a.b;',
        '    this.props.a.e.length;',
        '    this.props.a.e.anyProp;',
        '    this.props.a.c.toString();',
        '    this.props.a.c.someThingElse();',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.oneOfType([',
        '    React.PropTypes.shape({',
        '      c: React.PropTypes.number,',
        '      e: React.PropTypes.array',
        '    })',
        '  ])',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [
        {message: '\'a.length\' is missing in props validation for Hello'},
        {message: '\'a.b\' is missing in props validation for Hello'},
        {message: '\'a.e.anyProp\' is missing in props validation for Hello'},
        {message: '\'a.c.someThingElse\' is missing in props validation for Hello'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.arr.toFixed();',
        '    this.props.bo.push();',
        '    this.props.fu.push();',
        '    this.props.numb.propX;',
        '    this.props.stri.tooString();',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  arr: React.PropTypes.array,',
        '  bo: React.PropTypes.bool,',
        '  fu: React.PropTypes.func,',
        '  numb: React.PropTypes.number,',
        '  stri: React.PropTypes.string',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [
        {message: '\'arr.toFixed\' is missing in props validation for Hello'},
        {message: '\'bo.push\' is missing in props validation for Hello'},
        {message: '\'fu.push\' is missing in props validation for Hello'},
        {message: '\'numb.propX\' is missing in props validation for Hello'},
        {message: '\'stri.tooString\' is missing in props validation for Hello'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { ',
        '      "aria-controls": ariaControls, ',
        '      propX,',
        '      ...props } = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "aria-controls": React.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'propX\' is missing in props validation for Hello'}
      ]
    }
  ]
});
