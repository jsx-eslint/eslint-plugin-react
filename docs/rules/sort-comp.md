# Enforce component methods order (react/sort-comp)

When creating React components it is more convenient to always follow the same organisation for method order to help you easily find lifecycle methods, event handlers, etc.

**Fixable:** This rule is automatically fixable using the [`sort-comp` transform](https://github.com/reactjs/react-codemod/blob/master/transforms/sort-comp.js) in [react-codemod](https://www.npmjs.com/package/react-codemod).

## Rule Details

The default configuration ensures that the following order must be followed:

  1. static methods and properties
  2. lifecycle methods: `displayName`, `propTypes`, `contextTypes`, `childContextTypes`, `mixins`, `statics`, `defaultProps`, `constructor`, `getDefaultProps`, `state`, `getInitialState`, `getChildContext`, `getDerivedStateFromProps`, `componentWillMount`, `UNSAFE_componentWillMount`, `componentDidMount`, `componentWillReceiveProps`, `UNSAFE_componentWillReceiveProps`, `shouldComponentUpdate`, `componentWillUpdate`, `UNSAFE_componentWillUpdate`, `getSnapshotBeforeUpdate`, `componentDidUpdate`, `componentDidCatch`, `componentWillUnmount` (in this order).
  3. custom methods
  4. `render` method

Examples of **incorrect** code for this rule:

```jsx
var Hello = createReactClass({
  render: function() {
    return <div>Hello</div>;
  },
  displayName : 'Hello'
});
```

Examples of **correct** code for this rule:

```jsx
var Hello = createReactClass({
  displayName : 'Hello',
  render: function() {
    return <div>Hello</div>;
  }
});
```

## Rule Options

This rule can take one argument to customize the components organisation.

```js
...
"react/sort-comp": [<enabled>, { order: <order>, groups: <groups> }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* `order`: optional array of methods to validate.
* `groups`: optional object of methods groups.

The default configuration is:

```js
{
  order: [
    'static-methods',
    'lifecycle',
    'everything-else',
    'render'
  ],
  groups: {
    lifecycle: [
      'displayName',
      'propTypes',
      'contextTypes',
      'childContextTypes',
      'mixins',
      'statics',
      'defaultProps',
      'constructor',
      'getDefaultProps',
      'state',
      'getInitialState',
      'getChildContext',
      'getDerivedStateFromProps',
      'componentWillMount',
      'UNSAFE_componentWillMount',
      'componentDidMount',
      'componentWillReceiveProps',
      'UNSAFE_componentWillReceiveProps',
      'shouldComponentUpdate',
      'componentWillUpdate',
      'UNSAFE_componentWillUpdate',
      'getSnapshotBeforeUpdate',
      'componentDidUpdate',
      'componentDidCatch',
      'componentWillUnmount'
    ]
  }
}
```
* `static-variables` This group is not specified by default, but can be used to enforce class static variable positioning.
* `static-methods` is a special keyword that refers to static class methods.
* `lifecycle` refers to the `lifecycle` group defined in `groups`.
* `everything-else` is a special group that matches all of the methods that do not match any of the other groups.
* `render` refers to the `render` method.
* `type-annotations`. This group is not specified by default, but can be used to enforce flow annotations' positioning.
* `getters` This group is not specified by default, but can be used to enforce class getters' positioning.
* `setters` This group is not specified by default, but can be used to enforce class setters' positioning.
* `instance-variables` This group is not specified by default, but can be used to enforce all other instance variables' positioning.
* `instance-methods` This group is not specified by default, but can be used to enforce all other instance methods' positioning.

You can override this configuration to match your needs.

For example, if you want to place your event handlers (`onClick`, `onSubmit`, etc.) before `render` but the other methods after it:

```js
"react/sort-comp": [1, {
  order: [
    'static-methods',
    'lifecycle',
    '/^on.+$/',
    'render',
    'everything-else'
  ]
}]
```

Examples of **incorrect** code for this rule, with the above configuration:

```jsx
var Hello = createReactClass({
  render: function() {
    return <div>Hello</div>;
  },
  onClick: function() {}
});
```

Examples of **correct** code for this rule, with the above configuration:

```jsx
var Hello = createReactClass({
  onClick: function() {},
  render: function() {
    return <div>Hello</div>;
  }
});
```

If you want to split your `render` method into smaller ones and keep them just before render:

```js
"react/sort-comp": [1, {
  order: [
    'static-methods',
    'lifecycle',
    'everything-else',
    'rendering',
  ],
  groups: {
    rendering: [
      '/^render.+$/',
      'render'
    ]
  }
}]
```

Examples of **incorrect** code for this rule, with the above configuration:

```jsx
var Hello = createReactClass({
  renderButton: function() {},
  onClick: function() {},
  render: function() {
    return <div>Hello</div>;
  }
});
```

Examples of **correct** code for this rule, with the above configuration:

```jsx
var Hello = createReactClass({
  onClick: function() {},
  renderButton: function() {},
  render: function() {
    return <div>Hello</div>;
  }
});
```

If you want to flow annotations to be at the top:

```js
"react/sort-comp": [1, {
  order: [
    'type-annotations',
    'static-methods',
    'lifecycle',
    'everything-else',
    'render',
  ],
}]
```

Examples of **incorrect** code for this rule, with the above configuration:

```jsx
class Hello extends React.Component<any, Props, void> {
  onClick() { this._someElem = true; }
  props: Props;
  _someElem: bool;
  render() {
    return <div>Hello</div>;
  }
}
```

Examples of **correct** code for this rule, with the above configuration:

```jsx
type Props = {};
class Hello extends React.Component<any, Props, void> {
  props: Props;
  _someElem: bool;
  onClick() { this._someElem = true; }
  render() {
    return <div>Hello</div>;
  }
}
```

## When Not To Use It

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If components organisation isn't a part of your coding standards, then you can leave this rule off.
