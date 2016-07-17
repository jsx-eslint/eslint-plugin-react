# Enforce component methods order (sort-comp)

When creating React components it is more convenient to always follow the same organisation for methods order to helps you to easily find lifecyle methods, event handlers, etc.

**Fixable:** This rule is automatically fixable using the [`sort-comp` transform](https://github.com/reactjs/react-codemod/blob/master/transforms/sort-comp.js) in [react-codemod](https://www.npmjs.com/package/react-codemod).

## Rule Details

With default configuration the following organisation must be followed:

  1. static methods and properties
  2. instance properties
  3. lifecycle methods: `displayName`, `propTypes`, `contextTypes`, `childContextTypes`, `mixins`, `statics`,`defaultProps`, `constructor`, `getDefaultProps`, `getInitialState`, `state`, `getChildContext`, `componentWillMount`, `componentDidMount`, `componentWillReceiveProps`, `shouldComponentUpdate`, `componentWillUpdate`, `componentDidUpdate`, `componentWillUnmount` (in this order).
  4. custom methods
  5. `render` method

The following patterns are considered warnings:

```js
var Hello = React.createClass({
  render: function() {
    return <div>Hello</div>;
  },
  displayName : 'Hello'
});
```

The following patterns are not considered warnings:

```js
var Hello = React.createClass({
  displayName : 'Hello',
  render: function() {
    return <div>Hello</div>;
  }
});
```

## Rule Options

This rule can take one argument to customize the components organisation.

```
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
    'instance-properties',
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
      'getInitialState',
      'state',
      'getChildContext',
      'componentWillMount',
      'componentDidMount',
      'componentWillReceiveProps',
      'shouldComponentUpdate',
      'componentWillUpdate',
      'componentDidUpdate',
      'componentWillUnmount'
    ]
  }
}
```

* `static-methods` is a special keyword that refers to static class methods.
* `instance-properties` is a special keyword that refers to class instance properties.
* `lifecycle` is referring to the `lifecycle` group defined in `groups`.
* `everything-else` is a special group that match all the methods that do not match any of the other groups.
* `render` is referring to the `render` method.

You can override this configuration to match your needs.

For example, if you want to place your event handlers (`onClick`, `onSubmit`, etc.) before `render` but the other methods after it:

```js
"react/sort-comp": [1, {
  order: [
    'static-methods',
    'instance-properties',
    'lifecycle',
    '/^on.+$/',
    'render',
    'everything-else'
  ]
}]
```

With the above configuration, the following patterns are considered warnings:

```js
var Hello = React.createClass({
  render: function() {
    return <div>Hello</div>;
  },
  onClick: function() {}
});
```

With the above configuration, the following patterns are not considered warnings:

```js
var Hello = React.createClass({
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
    'instance-properties',
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

With the above configuration, the following patterns are considered warnings:

```js
var Hello = React.createClass({
  renderButton: function() {},
  onClick: function() {},
  render: function() {
    return <div>Hello</div>;
  }
});
```

With the above configuration, the following patterns are not considered warnings:

```js
var Hello = React.createClass({
  onClick: function() {},
  renderButton: function() {},
  render: function() {
    return <div>Hello</div>;
  }
});
```

## When Not To Use It

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If components organisation isn't a part of your coding standards, then you can leave this rule off.
