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
    {
      code: `
        const ComponentOne = () => <></>;
        const ComponentTwo = () => <></>;
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        export const ComponentOne = () => <></>;
        const ComponentTwo = () => <></>;
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        const ComponentOne = () => <></>;
        const ComponentTwo = () => <></>;
        module.exports = { ComponentOne };
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        const ComponentOne = () => <></>;
        const ComponentTwo = () => <></>;
        export default ComponentOne;
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        function ComponentOne() { return <></> };
        const ComponentTwo = () => <></>;
        export default ComponentOne;
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        function ComponentOne() { return <></> };
        function ComponentTwo() { return <></> };
        export default ComponentOne;
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        import React, {Component} from "react";
        export class ComponentOne extends Component() { render() { return <></>; }};
        function ComponentTwo() { return <></> };
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        import React, {Component} from "react";
        class ComponentOne extends Component() { render() { return <></>; }};
        function ComponentTwo() { return <></> };
        export default ComponentOne;
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        const ComponentOne = () => <></>;
        const ComponentTwo = () => <></>;
        export { ComponentOne };
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        export function ComponentOne() { return <></>; }
        function ComponentTwo() { return <></>; }
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        const ComponentOne = () => <></>;
        const ComponentTwo = () => <></>;
        module.exports = ComponentOne;
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        const ComponentOne = () => <></>;
        const ComponentTwo = () => <></>;
        export default function() { return <ComponentOne />; }
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        function ComponentOne() { return <></>; }
        const ComponentTwo = () => <></>;
        export { ComponentOne as default };
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        import React from 'react';
        export default class ComponentOne extends React.Component {
          render() { return <></>; }
        }
        class ComponentTwo extends React.Component {
          render() { return <></>; }
        }
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        import React from 'react';
        class ComponentOne extends React.Component {
          render() { return <></>; }
        }
        class ComponentTwo extends React.Component {
          render() { return <></>; }
        }
        export { ComponentOne };
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        import React, { memo } from 'react';
        const ComponentOne = memo(() => <></>);
        const ComponentTwo = () => <></>;
        export default ComponentOne;
      `,
      options: [{ ignorePrivate: true }],
    },
    {
      code: `
        import React from "react";
        export default function Component(props) { return <div>{props.children}</div>; }
        function ComponentTwo(props) { return <div>{props.children}</div>; }
      `,
      options: [{ ignorePrivate: true }],
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
    {
      code: `
        export const ComponentOne = () => <></>;
        export const ComponentTwo = () => <></>;
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        const ComponentOne = () => <></>;
        const ComponentTwo = () => <></>;
        module.exports = { ComponentOne, ComponentTwo };
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        const ComponentOne = () => <></>;
        export const ComponentTwo = () => <></>;
        export default ComponentOne;
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        export function ComponentOne() { return <></> };
        export const ComponentTwo = () => <></>;
        export default ComponentTwo;
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        function ComponentOne() { return <></> };
        export function ComponentTwo() { return <></> };
        export default ComponentOne;
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        import React, {Component} from "react";
        export class ComponentOne extends Component() { render() { return <></>; }};
        export function ComponentTwo() { return <></> };
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        import React, {Component} from "react";
        class ComponentOne extends Component() { render() { return <></>; }};
        export function ComponentTwo() { return <></> };
        export default ComponentOne;
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        import React, {Component} from "react";
        class ComponentOne extends Component() { render() { return <></>; }};
        function ComponentTwo() { return <></> };
        export default ComponentOne;
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        const ComponentOne = () => <></>;
        const ComponentTwo = () => <></>;
        export { ComponentOne };
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        export function ComponentOne() { return <></>; }
        function ComponentTwo() { return <></>; }
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        const ComponentOne = () => <></>;
        const ComponentTwo = () => <></>;
        module.exports = ComponentOne;
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        const ComponentOne = () => <></>;
        const ComponentTwo = () => <></>;
        export default function() { return <ComponentOne />; }
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        function ComponentOne() { return <></>; }
        const ComponentTwo = () => <></>;
        export { ComponentOne as default };
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        import React from 'react';
        export default class ComponentOne extends React.Component {
          render() { return <></>; }
        }
        class ComponentTwo extends React.Component {
          render() { return <></>; }
        }
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        import React from 'react';
        class ComponentOne extends React.Component {
          render() { return <></>; }
        }
        class ComponentTwo extends React.Component {
          render() { return <></>; }
        }
        export { ComponentOne };
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        import React, { memo } from 'react';
        const ComponentOne = memo(() => <></>);
        const ComponentTwo = () => <></>;
        export default ComponentOne;
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        import React from "react";
        export default function Component(props) { return <div>{props.children}</div>; }
        export function ComponentTwo(props) { return <div>{props.children}</div>; }
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
    {
      code: `
        import React from "react";
        export function componentOne(props) { return <div>{props.children}</div>; }
        export function ComponentOne(props) { return <div>{props.children}</div>; }
      `,
      options: [{ ignorePrivate: true }],
      errors: [{ messageId: 'onlyOneExportedComponent' }],
    },
  ]),
});
