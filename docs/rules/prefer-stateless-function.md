# Enforce stateless React Components to be written as a pure function (prefer-stateless-function)

Stateless functional components are more simple than class based components and will benefit from future React performance optimizations specific to these components.

## Rule Details

This rule will check your class based React components for

* methods/properties other than `displayName`, `propTypes`, `render` and useless constructor (same detection as ESLint [no-useless-constructor rule](http://eslint.org/docs/rules/no-useless-constructor))
* instance property other than `this.props` and `this.context`
* extension of `React.PureComponent` ()
* presence of `ref` attribute in JSX
* `render` method that return anything but JSX: `undefined`, `null`, etc. (only in React <15.0.0, see [shared settings](https://github.com/yannickcr/eslint-plugin-react/blob/master/README.md#configuration) for React version configuration)

If none of these elements are found, the rule will warn you to write this component as a pure function.

The following pattern is considered a warning:

```jsx
var Hello = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

The following pattern is not considered a warning:

```jsx
const Foo = function(props) {
  return <div>{props.foo}</div>;
};
```

The following pattern is not considered a warning in React <15.0.0:

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
"prefer-stateless-function": [<enabled>, { "ignorePureComponent": <ignorePureComponent> }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* `ignorePureComponent`: optional boolean set to `true` to ignore components extending from `React.PureComponent` (default to `false`).

### `ignorePureComponent`

When `true` the rule will ignore Components extending from `React.PureComponent` that use `this.props` or `this.context`.

The following patterns is considered okay and does not cause warnings:

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
