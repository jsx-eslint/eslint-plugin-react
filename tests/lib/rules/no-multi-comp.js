/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-multi-comp');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Combinatorial test generation for ignoreInvalid
// ------------------------------------------------------------------------------
// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {Function} ComponentGenerator
 * @param {string} name - The name of the component to be generated.
 * @returns {string} - The component declaration.
 */

// eslint-disable-next-line valid-jsdoc
/**
 * @type {ComponentGenerator[]} Array of different ways to output valid code for instantiating a React component with the given name.
 */
const SIMPLE_COMPONENT_TYPES = [
  (name) => `const ${name} = () => <></>;`, // arrow function component
  (name) => `let ${name} = () => <></>;`, // arrow function component (with let)
  (name) => `var ${name} = () => <></>;`, // arrow function component (with var)
  (name) => `const ${name} = memo(() => <></>);`, // memoized anonymous component
  (name) => `const ${name} = async () => <></>;`, // async component (react server components)
];

// eslint-disable-next-line valid-jsdoc
/**
 * @type {ComponentGenerator[]} Array of different ways to output valid code for instantiating a React component with the given name.
 */
const COMPLEX_COMPONENT_TYPES = [
  (name) => `function ${name}() { return <></>; }`, // standard function component
  (name) => `class ${name} extends React.Component {
    render() { return <></>; }
  }`, // class component
];

/**
 * Helper function for combinatorial testing of no-multi-comp ignoreInternal rule.
 *
 * @typedef {Function} ComponentExportGenerator
 * @param {ComponentGenerator} compOne - Generator function for the first component to export.
 * @param {string} compOneName - The name of the first component, which will typically be exported.
 * @param {ComponentGenerator} compTwo - Generator function for the second component to export.
 * @param {string} compTwoName - The name of the second component. This will be exported in invalid scenarios.
 * @param {string} exportRename - A potential rename of the export for the first component, used by some scenarios.
 * @returns {string} - A (nearly) complete test case - although we also prepend a generic import string.
 */

// eslint-disable-next-line valid-jsdoc
/**
 * @type {ComponentExportGenerator[]}
 */
const EXPORT_TYPES_VALID = [
  (compOne, compOneName, compTwo, compTwoName) => `
    ${compOne(compOneName)}
    ${compTwo(compTwoName)}`, // no export at all
  // DECLARATION TIME EXPORTS
  (compOne, compOneName, compTwo, compTwoName) => `
    export ${compOne(compOneName)}
    ${compTwo(compTwoName)}`, // standard export
  (compOne, compOneName, compTwo, compTwoName, exportRename) => `
    ${compOne(compOneName)}
    ${compTwo(compTwoName)}
    module.exports = { ${exportRename} : ${compOneName} }`, // module export with rename, post declaration
  // nb: module export at declaration time will be handled separately
  // POST DECLARATION EXPORTS
  (compOne, compOneName, compTwo, compTwoName) => `
    ${compOne(compOneName)}
    ${compTwo(compTwoName)}
    export default ${compOneName}`, // default export, post declaration
  (compOne, compOneName, compTwo, compTwoName) => `
    ${compOne(compOneName)}
    ${compTwo(compTwoName)}
    export ${compOneName}`, //  export, post declaration
  (compOne, compOneName, compTwo, compTwoName) => `
    ${compOne(compOneName)}
    ${compTwo(compTwoName)}
    module.exports = { ${compOneName} }`, // module export, post declaration
  (compOne, compOneName, compTwo, compTwoName, exportRename) => `
    ${compOne(compOneName)}
    ${compTwo(compTwoName)}
    module.exports = { ${exportRename} : ${compOneName} }`, // module export with rename, post declaration
  (compOne, compOneName, compTwo, compTwoName) => `
    ${compOne(compOneName)}
    ${compTwo(compTwoName)}
    export default function() { return <${compOneName} />; }`, // exporting component with indirection
];

// eslint-disable-next-line valid-jsdoc
/**
 * Special case: inline `export default` syntax cannot be followed by `const, let, var`
 *
 * @type {ComponentExportGenerator[]}
 */
const EXPORT_TYPES_VALID_COMPLEX = [
  (compOne, compOneName, compTwo, compTwoName) => `
    export default ${compOne(compOneName)}
    ${compTwo(compTwoName)}`, // default export
];

// eslint-disable-next-line valid-jsdoc
/**
 * @type {ComponentExportGenerator[]}
 */
const EXPORT_TYPES_INVALID = [
  // DECLARATION TIME EXPORTS
  (compOne, compOneName, compTwo, compTwoName) => `
    export ${compOne(compOneName)}
    export ${compTwo(compTwoName)}`, // standard export
  // nb: module export at declaration time will be handled separately
  // POST DECLARATION EXPORTS
  (compOne, compOneName, compTwo, compTwoName) => `
    ${compOne(compOneName)}
    ${compTwo(compTwoName)}
    export default ${compOneName}
    export ${compTwoName}`, // default export, post declaration
  (compOne, compOneName, compTwo, compTwoName) => `
    ${compOne(compOneName)}
    ${compTwo(compTwoName)}
    export ${compOneName}
    export ${compTwoName}`, //  export, post declaration
  (compOne, compOneName, compTwo, compTwoName) => `
    ${compOne(compOneName)}
    ${compTwo(compTwoName)}
    module.exports = { ${compOneName} ${compTwoName} }`, // module export, post declaration
];

// eslint-disable-next-line valid-jsdoc
/**
 * @type {ComponentExportGenerator[]}
 */
const EXPORT_TYPES_INVALID_COMPLEX = [
  // DECLARATION TIME EXPORTS
  (compOne, compOneName, compTwo, compTwoName) => `
    export default ${compOne(compOneName)}
    export ${compTwo(compTwoName)}`, // default export
];

/**
 * @param {ComponentExportGenerator[]} scenarioArray array of scenario generator functions which we will now convert into strings
 * @param {ComponentGenerator[]} componentTypes array of components to generate on
 * @param {boolean} [invalid] whether generated scenarios should expect to fail
 * @returns {{code: string, options: object[], errors: object[]}[]}
 */
const generateScenarios = (scenarioArray, componentTypes, invalid = false) => {
  const result = [];
  for (const scenario of scenarioArray) {
    for (const first of componentTypes) {
      for (const second of SIMPLE_COMPONENT_TYPES) {
        result.push({
          code: `
        import React, { memo, Component } from 'react';
        ${scenario(first, 'ComponentOne', second, 'ComponentTwo', 'RenamedComponent')}`,
          options: [{ ignoreInternal: true }],
          errors: invalid ? [{ messageId: 'onlyOneExportedComponent' }] : undefined,
        });
      }
    }
  }
  return result;
};

const ignoreInternalValidScenarios = [
  ...generateScenarios(EXPORT_TYPES_VALID, [...SIMPLE_COMPONENT_TYPES, ...COMPLEX_COMPONENT_TYPES]),
  ...generateScenarios(EXPORT_TYPES_VALID_COMPLEX, COMPLEX_COMPONENT_TYPES),
];
const ignoreInternalInvalidScenarios = [
  ...generateScenarios(EXPORT_TYPES_INVALID, [...SIMPLE_COMPONENT_TYPES, ...COMPLEX_COMPONENT_TYPES]),
  ...generateScenarios(EXPORT_TYPES_INVALID_COMPLEX, COMPLEX_COMPONENT_TYPES),
];

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-multi-comp', rule, {
  valid: parsers.all([
    {
      code: `
        var Hello = require('./components/Hello');
        var HelloJohn = createReactClass({
          render: function() {
            return <Hello name="John" />;
          }
        });
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
    },
    {
      code: `
        var Heading = createReactClass({
          render: function() {
            return (
              <div>
                {this.props.buttons.map(function(button, index) {
                  return <Button {...button} key={index}/>;
                })}
              </div>
            );
          }
        });
      `,
    },
    {
      code: `
        function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
        function HelloAgain(props) {
          return <div>Hello again {props.name}</div>;
        }
      `,
      options: [{ ignoreStateless: true }],
    },
    {
      code: `
        function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
        class HelloJohn extends React.Component {
          render() {
            return <Hello name="John" />;
          }
        }
      `,
      options: [{ ignoreStateless: true }],
    },
    {
    // multiple non-components
      code: `
        import React, { createElement } from "react"
        const helperFoo = () => {
          return true;
        };
        function helperBar() {
          return false;
        };
        function RealComponent() {
          return createElement("img");
        };
      `,
      parserOptions: Object.assign({ sourceType: 'module' }, parserOptions),
    },
    {
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
      options: [{ ignoreStateless: true }],
    },
    {
      code: `
        class StoreListItem extends React.PureComponent {
          // A bunch of stuff here
        }
        export default React.forwardRef((props, ref) => <StoreListItem {...props} forwardRef={ref} />);
      `,
      options: [{ ignoreStateless: false }],
    },
    {
      code: `
        class StoreListItem extends React.PureComponent {
          // A bunch of stuff here
        }
        export default React.forwardRef((props, ref) => {
          return <StoreListItem {...props} forwardRef={ref} />
        });
      `,
      options: [{ ignoreStateless: false }],
    },
    {
      code: `
        const HelloComponent = (props) => {
          return <div></div>;
        }
        export default React.forwardRef((props, ref) => <HelloComponent {...props} forwardRef={ref} />);
      `,
      options: [{ ignoreStateless: false }],
    },
    {
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
      options: [{ ignoreStateless: true }],
    },
    {
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
      options: [{ ignoreStateless: true }],
    },
    {
      code: `
        const HelloComponent = (props) => {
          return <div></div>;
        }
        export default React.memo((props, ref) => <HelloComponent {...props} />);
      `,
      options: [{ ignoreStateless: true }],
    },
    {
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
      features: ['class fields'],
    },
    {
      code: `
        const MenuList = forwardRef(({onClose, ...props}, ref) => {
          const {t} = useTranslation();
          const handleLogout = useLogoutHandler();

          const onLogout = useCallback(() => {
            onClose();
            handleLogout();
          }, [onClose, handleLogout]);

          return (
            <MuiMenuList ref={ref} {...props}>
              <MuiMenuItem key="logout" onClick={onLogout}>
                {t('global-logout')}
              </MuiMenuItem>
            </MuiMenuList>
          );
        });

        MenuList.displayName = 'MenuList';

        MenuList.propTypes = {
          onClose: PropTypes.func,
        };

        MenuList.defaultProps = {
          onClose: () => null,
        };

        export default MenuList;
      `,
    },
    {
      code: `
        const MenuList = forwardRef(({ onClose, ...props }, ref) => {
          const onLogout = useCallback(() => {
            onClose()
          }, [onClose])

          return (
            <BlnMenuList ref={ref} {...props}>
              <BlnMenuItem key="logout" onClick={onLogout}>
                Logout
              </BlnMenuItem>
            </BlnMenuList>
          )
        })

        MenuList.displayName = 'MenuList'

        MenuList.propTypes = {
          onClose: PropTypes.func
        }

        MenuList.defaultProps = {
          onClose: () => null
        }

        export default MenuList
      `,
    },
    ...ignoreInternalValidScenarios,
    { // special case: components declared inside of module export block
      code: `
        const ComponentOne = () => <></>;
        module.exports = {
          ComponentTwo() { return <></>; }
        };
      `,
      options: [{ ignoreInternal: true }],
    },
    { // basic testing for intersection of ignoreStateless and ignoreInternal
      code: `
        export function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
        export function HelloAgain(props) {
          return <div>Hello again {props.name}</div>;
        }
      `,
      options: [{ ignoreStateless: true, ignoreInternal: true }],
    },
    {
      code: `
        export const HelloComponent = (props) => {
          return <div></div>;
        }
        export default React.memo((props, ref) => <HelloComponent {...props} />);
      `,
      options: [{ ignoreStateless: true, ignoreInternal: true }],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
        var HelloJohn = createReactClass({
          render: function() {
            return <Hello name="John" />;
          }
        });
      `.split('\n').join('\r'),
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 7,
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
        class HelloJohn extends React.Component {
          render() {
            return <Hello name="John" />;
          }
        }
        class HelloJohnny extends React.Component {
          render() {
            return <Hello name="Johnny" />;
          }
        }
      `.split('\n').join('\r'),
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 7,
        },
        {
          messageId: 'onlyOneComponent',
          line: 12,
        },
      ],
    },
    {
      code: `
        function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
        function HelloAgain(props) {
          return <div>Hello again {props.name}</div>;
        }
      `,
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 5,
        },
      ],
    },
    {
      code: `
        function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
        class HelloJohn extends React.Component {
          render() {
            return <Hello name="John" />;
          }
        }
      `,
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 5,
        },
      ],
    },
    {
      code: `
        export default {
          RenderHello(props) {
            let {name} = props;
            return <div>{name}</div>;
          },
          RenderHello2(props) {
            let {name} = props;
            return <div>{name}</div>;
          }
        };
      `,
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 7,
        },
      ],
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
      features: ['fragment'],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 7,
        },
      ],
    },
    {
      code: `
        class StoreListItem extends React.PureComponent {
          // A bunch of stuff here
        }
        export default React.forwardRef((props, ref) => <div><StoreListItem {...props} forwardRef={ref} /></div>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 5,
        },
      ],
    },
    {
      code: `
        const HelloComponent = (props) => {
          return <div></div>;
        }
        const HelloComponent2 = React.forwardRef((props, ref) => <div></div>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 5,
        },
      ],
    },
    {
      code: `
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = React.forwardRef((props, ref) => <><HelloComponent></HelloComponent></>);
      `,
      options: [{ ignoreStateless: false }],
      features: ['fragment'],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 5,
        },
      ],
    },
    {
      code: `
        const forwardRef = React.forwardRef;
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const memo = React.memo;
        const HelloComponent = (props) => {
          return <div></div>;
        };
        const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const {forwardRef} = React;
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const {memo} = React;
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        import React, { memo } from 'react';
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        import {forwardRef} from 'react';
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const { memo } = require('react');
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const {forwardRef} = require('react');
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const forwardRef = require('react').forwardRef;
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const memo = require('react').memo;
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Foo, { memo, forwardRef } from 'foo';
        const Text = forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        })
        const Label = memo(() => <Text />);
      `,
      settings: {
        react: {
          pragma: 'Foo',
        },
      },
      errors: [{ messageId: 'onlyOneComponent' }],
    },
    ...ignoreInternalInvalidScenarios,
    { // special case: components declared inside of module export block
      code: `
        module.exports = {
          ComponentOne() { return <></>; }
          ComponentTwo() { return <></>; }
        };
      `,
      options: [{ ignoreInternal: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
  ]),
});
