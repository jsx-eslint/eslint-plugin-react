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
  }, {
    code: `
      import React from 'react';
      function memo() {
        var outOfScope = "hello"
        return null;
      }
      class ComponentY extends React.Component {
        memoCities = memo((cities) => cities.map((v) => ({ label: v })));
        render() {
          return (
            <div>
              <div>Counter</div>
            </div>
          );
        }
      }
    `,
    parser: parsers.BABEL_ESLINT
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
      messageId: 'onlyOneComponent',
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
      messageId: 'onlyOneComponent',
      line: 6
    }, {
      messageId: 'onlyOneComponent',
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
      messageId: 'onlyOneComponent',
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
      messageId: 'onlyOneComponent',
      line: 4
    }]
  }, {
    code: [
      'export default {',
      '  RenderHello(props) {',
      '    let {name} = props;',
      '    return <div>{name}</div>;',
      '  },',
      '  RenderHello2(props) {',
      '    let {name} = props;',
      '    return <div>{name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'onlyOneComponent',
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
      messageId: 'onlyOneComponent',
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
      messageId: 'onlyOneComponent',
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
      messageId: 'onlyOneComponent',
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
      messageId: 'onlyOneComponent',
      line: 5
    }]
  }, {
    code: `
      const forwardRef = React.forwardRef;
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const memo = React.memo;
      const HelloComponent = (props) => {
        return <div></div>;
      };
      const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const {forwardRef} = React;
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const {memo} = React;
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      import React, { memo } from 'react';
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      import {forwardRef} from 'react';
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const { memo } = require('react');
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const {forwardRef} = require('react');
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const forwardRef = require('react').forwardRef;
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const memo = require('react').memo;
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
        import Foo, { memo, forwardRef } from 'foo';
        const Text = forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        })
        const Label = memo(() => <Text />);
      `,
    settings: {
      react: {
        pragma: 'Foo'
      }
    },
    errors: [{messageId: 'onlyOneComponent'}]
  }]
});
