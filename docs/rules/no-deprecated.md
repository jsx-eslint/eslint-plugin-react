# Prevent usage of deprecated methods (no-deprecated)

Several methods are deprecated between React versions. This rule will warn you if you try to use a deprecated method.

## Rule Details

The following patterns are considered warnings:

```js
React.render(<MyComponent />, root);

React.unmountComponentAtNode(root);

React.findDOMNode(this.refs.foo);

React.renderToString(<MyComponent />);

React.renderToStaticMarkup(<MyComponent />);
```

The following patterns are not considered warnings:

```js
ReactDOM.render(<MyComponent />, root);

// When [1, {"react": "0.13.0"}]
ReactDOM.findDOMNode(this.refs.foo);
```

## Rule Options

By default this rule will warn to every methods marked as deprecated. You can limit it to an older React version if you are not using the latest one:

```js
"rules": {
  "react/no-deprecated": [1, {"react": "0.12.0"}] // Will warn for every deprecated methods in React 0.12.0 and below
}
```
