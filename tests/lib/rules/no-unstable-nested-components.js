/**
 * @fileoverview Prevent creating unstable components inside components
 * @author Ari Perkkiö
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-unstable-nested-components');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const ERROR_MESSAGE = 'Declare this component outside parent component "ParentComponent" or memoize it.';
const ERROR_MESSAGE_WITHOUT_NAME = 'Declare this component outside parent component or memoize it.';
const ERROR_MESSAGE_COMPONENT_AS_PROPS = `${ERROR_MESSAGE} If you want to allow component creation in props, set allowAsProps option to true.`;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-unstable-nested-components', rule, {
  valid: parsers.all([
    {
      code: `
        function ParentComponent() {
          return (
            <div>
              <OutsideDefinedFunctionComponent />
            </div>
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          return React.createElement(
            "div",
            null,
            React.createElement(OutsideDefinedFunctionComponent, null)
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          return (
            <SomeComponent
              footer={<OutsideDefinedComponent />}
              header={<div />}
              />
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          return React.createElement(SomeComponent, {
            footer: React.createElement(OutsideDefinedComponent, null),
            header: React.createElement("div", null)
          });
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          const MemoizedNestedComponent = React.useCallback(() => <div />, []);

          return (
            <div>
              <MemoizedNestedComponent />
            </div>
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          const MemoizedNestedComponent = React.useCallback(
            () => React.createElement("div", null),
            []
          );

          return React.createElement(
            "div",
            null,
            React.createElement(MemoizedNestedComponent, null)
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          const MemoizedNestedFunctionComponent = React.useCallback(
            function () {
              return <div />;
            },
            []
          );

          return (
            <div>
              <MemoizedNestedFunctionComponent />
            </div>
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          const MemoizedNestedFunctionComponent = React.useCallback(
            function () {
              return React.createElement("div", null);
            },
            []
          );

          return React.createElement(
            "div",
            null,
            React.createElement(MemoizedNestedFunctionComponent, null)
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent(props) {
          // Should not interfere handler declarations
          function onClick(event) {
            props.onClick(event.target.value);
          }

          const onKeyPress = () => null;

          function getOnHover() {
            return function onHover(event) {
              props.onHover(event.target);
            }
          }

          return (
            <div>
              <button
                onClick={onClick}
                onKeyPress={onKeyPress}
                onHover={getOnHover()}

                // These should not be considered as components
                maybeComponentOrHandlerNull={() => null}
                maybeComponentOrHandlerUndefined={() => undefined}
                maybeComponentOrHandlerBlank={() => ''}
                maybeComponentOrHandlerString={() => 'hello-world'}
                maybeComponentOrHandlerNumber={() => 42}
                maybeComponentOrHandlerArray={() => []}
                maybeComponentOrHandlerObject={() => {}} />
            </div>
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          function getComponent() {
            return <div />;
          }

          return (
            <div>
              {getComponent()}
            </div>
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          function getComponent() {
            return React.createElement("div", null);
          }

          return React.createElement("div", null, getComponent());
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
            return (
              <RenderPropComponent>
                {() => <div />}
              </RenderPropComponent>
            );
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
            return (
              <RenderPropComponent children={() => <div />} />
            );
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          return (
            <ComplexRenderPropComponent
              listRenderer={data.map((items, index) => (
                <ul>
                  {items[index].map((item) =>
                    <li>
                      {item}
                    </li>
                  )}
                </ul>
              ))
              }
            />
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          return React.createElement(
              RenderPropComponent,
              null,
              () => React.createElement("div", null)
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent(props) {
          return (
            <ul>
              {props.items.map(item => (
                <li key={item.id}>
                  {item.name}
                </li>
              ))}
            </ul>
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent(props) {
          return (
            <List items={props.items.map(item => {
              return (
                <li key={item.id}>
                  {item.name}
                </li>
              );
            })}
            />
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent(props) {
          return React.createElement(
            "ul",
            null,
            props.items.map(() =>
              React.createElement(
                "li",
                { key: item.id },
                item.name
              )
            )
          )
        }
      `,
    },
    {
      code: `
        function ParentComponent(props) {
          return (
            <ul>
              {props.items.map(function Item(item) {
                return (
                  <li key={item.id}>
                    {item.name}
                  </li>
                );
              })}
            </ul>
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent(props) {
          return React.createElement(
            "ul",
            null,
            props.items.map(function Item() {
              return React.createElement(
                "li",
                { key: item.id },
                item.name
              );
            })
          );
        }
      `,
    },
    {
      code: `
        function createTestComponent(props) {
          return (
            <div />
          );
        }
      `,
    },
    {
      code: `
        function createTestComponent(props) {
          return React.createElement("div", null);
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          return (
            <ComponentWithProps footer={() => <div />} />
          );
        }
      `,
      options: [{ allowAsProps: true }],
    },
    {
      code: `
        function ParentComponent() {
          return React.createElement(ComponentWithProps, {
            footer: () => React.createElement("div", null)
          });
        }
      `,
      options: [{ allowAsProps: true }],
    },
    {
      code: `
        function ParentComponent() {
          return (
            <SomeComponent item={{ children: () => <div /> }} />
          )
        }
      `,
      options: [{ allowAsProps: true }],
    },
    {
      code: `
        function ParentComponent() {
          return (
            <ComponentForProps renderFooter={() => <div />} />
          );
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          return React.createElement(ComponentForProps, {
            renderFooter: () => React.createElement("div", null)
          });
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          useEffect(() => {
            return () => null;
          });

          return <div />;
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          return (
            <SomeComponent renderers={{ Header: () => <div /> }} />
          )
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          return (
            <SomeComponent renderMenu={() => (
              <RenderPropComponent>
                {items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </RenderPropComponent>
            )} />
          )
        }
      `,
    },
    {
      code: `
        const ParentComponent = () => (
          <SomeComponent
            components={[
              <ul>
                {list.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>,
            ]}
          />
        );
     `,
    },
    {
      code: `
        function ParentComponent() {
          const rows = [
            {
              name: 'A',
              render: (props) => <Row {...props} />
            },
          ];

          return <Table rows={rows} />;
        }
      `,
    },
    {
      code: `
        function ParentComponent() {
          return <SomeComponent renderers={{ notComponent: () => null }} />;
        }
      `,
    },
    {
      code: `
        const ParentComponent = createReactClass({
          displayName: "ParentComponent",
          statics: {
            getSnapshotBeforeUpdate: function () {
              return null;
            },
          },
          render() {
            return <div />;
          },
        });
      `,
    },
    {
      code: `
        function ParentComponent() {
          const rows = [
            {
              name: 'A',
              notPrefixedWithRender: (props) => <Row {...props} />
            },
          ];

          return <Table rows={rows} />;
        }
      `,
    },
    /* TODO These minor cases are currently falsely marked due to component detection
    {
      code: `
        function ParentComponent() {
          const _renderHeader = () => <div />;
          return <div>{_renderHeader()}</div>;
        }
      `
    },
    {
      // https://github.com/emotion-js/emotion/blob/a89d4257b0246a1640a99f77838e5edad4ec4386/packages/jest/test/react-enzyme.test.js#L26-L28
      code: `
        const testCases = {
          basic: {
            render() {
              const Component = () => <div />;
              return <div />;
            }
          }
        }
        `
    },
    */
  ]),

  invalid: parsers.all([
    {
      code: `
        function ParentComponent() {
          function UnstableNestedFunctionComponent() {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedFunctionComponent />
            </div>
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        function ParentComponent() {
          function UnstableNestedFunctionComponent() {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedFunctionComponent, null)
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        function ParentComponent() {
          const UnstableNestedVariableComponent = () => {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedVariableComponent />
            </div>
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        function ParentComponent() {
          const UnstableNestedVariableComponent = () => {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedVariableComponent, null)
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        const ParentComponent = () => {
          function UnstableNestedFunctionComponent() {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedFunctionComponent />
            </div>
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        const ParentComponent = () => {
          function UnstableNestedFunctionComponent() {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedFunctionComponent, null)
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        export default () => {
          function UnstableNestedFunctionComponent() {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedFunctionComponent />
            </div>
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE_WITHOUT_NAME }],
    },
    {
      code: `
        export default () => {
          function UnstableNestedFunctionComponent() {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedFunctionComponent, null)
          );
        };
      `,
      errors: [{ message: ERROR_MESSAGE_WITHOUT_NAME }],
    },
    {
      code: `
        const ParentComponent = () => {
          const UnstableNestedVariableComponent = () => {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedVariableComponent />
            </div>
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        const ParentComponent = () => {
          const UnstableNestedVariableComponent = () => {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedVariableComponent, null)
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        function ParentComponent() {
          class UnstableNestedClassComponent extends React.Component {
            render() {
              return <div />;
            }
          };

          return (
            <div>
              <UnstableNestedClassComponent />
            </div>
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        function ParentComponent() {
          class UnstableNestedClassComponent extends React.Component {
            render() {
              return React.createElement("div", null);
            }
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedClassComponent, null)
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        class ParentComponent extends React.Component {
          render() {
            class UnstableNestedClassComponent extends React.Component {
              render() {
                return <div />;
              }
            };

            return (
              <div>
                <UnstableNestedClassComponent />
              </div>
            );
          }
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        class ParentComponent extends React.Component {
          render() {
            class UnstableNestedClassComponent extends React.Component {
              render() {
                return React.createElement("div", null);
              }
            }

            return React.createElement(
              "div",
              null,
              React.createElement(UnstableNestedClassComponent, null)
            );
          }
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        class ParentComponent extends React.Component {
          render() {
            function UnstableNestedFunctionComponent() {
              return <div />;
            }

            return (
              <div>
                <UnstableNestedFunctionComponent />
              </div>
            );
          }
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        class ParentComponent extends React.Component {
          render() {
            function UnstableNestedClassComponent() {
              return React.createElement("div", null);
            }

            return React.createElement(
              "div",
              null,
              React.createElement(UnstableNestedClassComponent, null)
            );
          }
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        class ParentComponent extends React.Component {
          render() {
            const UnstableNestedVariableComponent = () => {
              return <div />;
            }

            return (
              <div>
                <UnstableNestedVariableComponent />
              </div>
            );
          }
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        class ParentComponent extends React.Component {
          render() {
            const UnstableNestedClassComponent = () => {
              return React.createElement("div", null);
            }

            return React.createElement(
              "div",
              null,
              React.createElement(UnstableNestedClassComponent, null)
            );
          }
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        function ParentComponent() {
          function getComponent() {
            function NestedUnstableFunctionComponent() {
              return <div />;
            };

            return <NestedUnstableFunctionComponent />;
          }

          return (
            <div>
              {getComponent()}
            </div>
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        function ParentComponent() {
          function getComponent() {
            function NestedUnstableFunctionComponent() {
              return React.createElement("div", null);
            }

            return React.createElement(NestedUnstableFunctionComponent, null);
          }

          return React.createElement("div", null, getComponent());
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        function ComponentWithProps(props) {
          return <div />;
        }

        function ParentComponent() {
          return (
            <ComponentWithProps
              footer={
                function SomeFooter() {
                  return <div />;
                }
              } />
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE_COMPONENT_AS_PROPS }],
    },
    {
      code: `
        function ComponentWithProps(props) {
          return React.createElement("div", null);
        }

        function ParentComponent() {
          return React.createElement(ComponentWithProps, {
            footer: function SomeFooter() {
              return React.createElement("div", null);
            }
          });
        }
      `,
      errors: [{ message: ERROR_MESSAGE_COMPONENT_AS_PROPS }],
    },
    {
      code: `
        function ComponentWithProps(props) {
          return <div />;
        }

        function ParentComponent() {
            return (
              <ComponentWithProps footer={() => <div />} />
            );
        }
      `,
      errors: [{ message: ERROR_MESSAGE_COMPONENT_AS_PROPS }],
    },
    {
      code: `
        function ComponentWithProps(props) {
          return React.createElement("div", null);
        }

        function ParentComponent() {
          return React.createElement(ComponentWithProps, {
            footer: () => React.createElement("div", null)
          });
        }
      `,
      errors: [{ message: ERROR_MESSAGE_COMPONENT_AS_PROPS }],
    },
    {
      code: `
        function ParentComponent() {
            return (
              <RenderPropComponent>
                {() => {
                  function UnstableNestedComponent() {
                    return <div />;
                  }

                  return (
                    <div>
                      <UnstableNestedComponent />
                    </div>
                  );
                }}
              </RenderPropComponent>
            );
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        function RenderPropComponent(props) {
          return props.render({});
        }

        function ParentComponent() {
          return React.createElement(
            RenderPropComponent,
            null,
            () => {
              function UnstableNestedComponent() {
                return React.createElement("div", null);
              }

              return React.createElement(
                "div",
                null,
                React.createElement(UnstableNestedComponent, null)
              );
            }
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        function ComponentForProps(props) {
          return <div />;
        }

        function ParentComponent() {
          return (
            <ComponentForProps notPrefixedWithRender={() => <div />} />
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE_COMPONENT_AS_PROPS }],
    },
    {
      code: `
        function ComponentForProps(props) {
          return React.createElement("div", null);
        }

        function ParentComponent() {
          return React.createElement(ComponentForProps, {
            notPrefixedWithRender: () => React.createElement("div", null)
          });
        }
      `,
      errors: [{ message: ERROR_MESSAGE_COMPONENT_AS_PROPS }],
    },
    {
      code: `
        function ParentComponent() {
          return (
            <ComponentForProps someMap={{ Header: () => <div /> }} />
          );
        }
      `,
      errors: [{ message: ERROR_MESSAGE_COMPONENT_AS_PROPS }],
    },
    {
      code: `
        class ParentComponent extends React.Component {
          render() {
            const List = (props) => {
              const items = props.items
                .map((item) => (
                  <li key={item.key}>
                    <span>{item.name}</span>
                  </li>
                ));

              return <ul>{items}</ul>;
            };

            return <List {...this.props} />;
          }
        }
      `,
      // Only a single error should be shown. This can get easily marked twice.
      errors: [{ message: ERROR_MESSAGE }],
    },
  ]),
});
