/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-multi-comp');

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
ruleTester.run('no-multi-comp', rule, {

  valid: [{
    code: [
      'var Hello = require(\'./components/Hello\');',
      'var HelloJohn = createReactClass({',
      '  render: function() {',
      '    return <Hello name="John" />;',
      '  }',
      '});'
    ].join('\r')
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\r')
  }, {
    code: [
      'var Heading = createReactClass({',
      '  render: function() {',
      '    return (',
      '      <div>',
      '        {this.props.buttons.map(function(button, index) {',
      '          return <Button {...button} key={index}/>;',
      '        })}',
      '      </div>',
      '    );',
      '  }',
      '});'
    ].join('\r')
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'function HelloAgain(props) {',
      '  return <div>Hello again {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'class HelloJohn extends React.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}'
    ].join('\r'),
    options: [{
      ignoreStateless: true
    }]
  }, {
    // multiple non-components
    code: [
      'import React, { createElement } from "react"',
      'const helperFoo = () => {',
      '  return true;',
      '};',
      'function helperBar() {',
      '  return false;',
      '};',
      'function RealComponent() {',
      '  return createElement("img");',
      '};'
    ].join('\n'),
    parserOptions: Object.assign({sourceType: 'module'}, parserOptions)
  }, {
    code: `
      const Hello = React.memo(function(props) {
        return <div>Hello {props.name}</div>;
      });
      class HelloJohn extends React.Component {
        render() {
          return <Hello name="John" />;
        }
      }
    `,
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: `
  class StoreListItem extends React.PureComponent {
    // A bunch of stuff here
  }
  export default React.forwardRef((props, ref) => <StoreListItem {...props} forwardRef={ref} />);
  `,
    options: [{
      ignoreStateless: false
    }]
  }, {
    code: `
  class StoreListItem extends React.PureComponent {
    // A bunch of stuff here
  }
  export default React.forwardRef((props, ref) => {
    return <StoreListItem {...props} forwardRef={ref} />
  });
  `,
    options: [{
      ignoreStateless: false
    }]
  }, {
    code: `
  const HelloComponent = (props) => {
    return <div></div>;
  }
  export default React.forwardRef((props, ref) => <HelloComponent {...props} forwardRef={ref} />);
  `,
    options: [{
      ignoreStateless: false
    }]
  }, {
    code: `
  class StoreListItem extends React.PureComponent {
    // A bunch of stuff here
  }
  export default React.forwardRef(
    function myFunction(props, ref) {
      return <StoreListItem {...props} forwardedRef={ref} />;
    }
  );
  `,
    options: [{
      ignoreStateless: false
    }]
  }, {
    code: `
  class StoreListItem extends React.PureComponent {
    // A bunch of stuff here
  }
  export default React.forwardRef((props, ref) => <StoreListItem {...props} forwardRef={ref} />);
  `,
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: `
  class StoreListItem extends React.PureComponent {
    // A bunch of stuff here
  }
  export default React.forwardRef((props, ref) => {
    return <StoreListItem {...props} forwardRef={ref} />
  });
  `,
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: `
  const HelloComponent = (props) => {
    return <div></div>;
  }
  export default React.forwardRef((props, ref) => <HelloComponent {...props} forwardRef={ref} />);
  `,
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: `
  const HelloComponent = (props) => {
    return <div></div>;
  }
  class StoreListItem extends React.PureComponent {
    // A bunch of stuff here
  }
  export default React.forwardRef(
    function myFunction(props, ref) {
      return <StoreListItem {...props} forwardedRef={ref} />;
    }
  );
  `,
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: `
  const HelloComponent = (props) => {
    return <div></div>;
  }
  export default React.memo((props, ref) => <HelloComponent {...props} />);
  `,
    options: [{
      ignoreStateless: false
    }]
  }],

  invalid: [{
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});',
      'var HelloJohn = createReactClass({',
      '  render: function() {',
      '    return <Hello name="John" />;',
      '  }',
      '});'
    ].join('\r'),
    errors: [{
      message: 'Declare only one React component per file',
      line: 6
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}',
      'class HelloJohn extends React.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}',
      'class HelloJohnny extends React.Component {',
      '  render() {',
      '    return <Hello name="Johnny" />;',
      '  }',
      '}'
    ].join('\r'),
    errors: [{
      message: 'Declare only one React component per file',
      line: 6
    }, {
      message: 'Declare only one React component per file',
      line: 11
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'function HelloAgain(props) {',
      '  return <div>Hello again {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Declare only one React component per file',
      line: 4
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'class HelloJohn extends React.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}'
    ].join('\r'),
    errors: [{
      message: 'Declare only one React component per file',
      line: 4
    }]
  }, {
    code: [
      'export default {',
      '  renderHello(props) {',
      '    let {name} = props;',
      '    return <div>{name}</div>;',
      '  },',
      '  renderHello2(props) {',
      '    let {name} = props;',
      '    return <div>{name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Declare only one React component per file',
      line: 6
    }]
  },
  {
    code: `
      exports.Foo = function Foo() {
        return <></>
      }

      exports.createSomeComponent = function createSomeComponent(opts) {
        return function Foo() {
          return <>{opts.a}</>
        }
      }
    `,
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Declare only one React component per file',
      line: 7
    }]
  },
  {
    code: `
  class StoreListItem extends React.PureComponent {
    // A bunch of stuff here
  }
  export default React.forwardRef((props, ref) => <div><StoreListItem {...props} forwardRef={ref} /></div>);
  `,
    options: [{
      ignoreStateless: false
    }],
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Declare only one React component per file',
      line: 5
    }]
  }, {
    code: `
  const HelloComponent = (props) => {
    return <div></div>;
  }
  const HelloComponent2 = React.forwardRef((props, ref) => <div></div>);
  `,
    options: [{
      ignoreStateless: false
    }],
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Declare only one React component per file',
      line: 5
    }]
  }, {
    code: `
  const HelloComponent = (0, (props) => {
    return <div></div>;
  });
  const HelloComponent2 = React.forwardRef((props, ref) => <><HelloComponent></HelloComponent></>);
  `,
    options: [{
      ignoreStateless: false
    }],
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Declare only one React component per file',
      line: 5
    }]
  }]
});
