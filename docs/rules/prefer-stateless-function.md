# Enforce stateless React Components to be written as a pure function (react/prefer-stateless-function)

Stateless functional components are simpler than class based components and will benefit from future React performance optimizations specific to these components.

## Rule Details

This rule will check your class based React components for

* methods/properties other than `displayName`, `propTypes`, `contextTypes`, `defaultProps`, `render` and useless constructor (same detection as ESLint [no-useless-constructor rule](http://eslint.org/docs/rules/no-useless-constructor))
* instance property other than `this.props` and `this.context`
* extension of `React.PureComponent` (if the `ignorePureComponents` flag is true)
* presence of `ref` attribute in JSX
* the use of decorators
* methods inside a React Component that return JSX other than the `render()` method (if the `subRenderMethods` flag is true)
* `render` method that return anything but JSX: `undefined`, `null`, etc. (only in React <15.0.0, see [shared settings](https://github.com/yannickcr/eslint-plugin-react/blob/master/README.md#configuration) for React version configuration)

If none of these elements are found, the rule will warn you to write this component as a pure function.

The following pattern is considered a warning:

```jsx
var Hello = createReactClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

The following pattern is **not** considered a warning:

```jsx
const Foo = function(props, context) {
  const {
    location
  } = context.router;

  return <div>{props.foo}</div>;
};
```

The following pattern is **not** considered a warning in React <15.0.0:

```jsx
class Foo extends React.Component {
  render() {
    if (!this.props.foo) {
      return null
    }
    return <div>{this.props.foo}</div>;
  }
}
```


## Rule Options

```js
...
"react/prefer-stateless-function": [<enabled>, { "ignorePureComponents": <ignorePureComponents>, "subRenderMethods": <subRenderMethods> }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* `ignorePureComponents`: optional boolean set to `true` to ignore components extending from `React.PureComponent` (default to `false`).
* `subRenderMethods`: optional boolean set to `true` to also warn on methods in React Components that return JSX other than the `render()` method (default to `false`).

### `ignorePureComponents`

When `true` the rule will ignore Components extending from `React.PureComponent` that use `this.props` or `this.context`.

The following pattern is considered okay and does **not** cause warnings:

```jsx
class Foo extends React.PureComponent {
  render() {
    return <div>{this.props.foo}</div>;
  }
}
```

The following pattern is considered a warning because it's not using props or context:

```jsx
class Foo extends React.PureComponent {
  render() {
    return <div>Bar</div>;
  }
}
```

### `subRenderMethods`

When `true` the rule will warn when you use methods that return JSX in a React Component other than the `render()` method

The following patterns is considered a warning:

```jsx
class Foo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {myState: ""}
  }

  renderFoo() {
    return <span>{this.state.myState}</span>
  }

  render() {
    return <div>{this.renderFoo()}</div>;
  }
}
```