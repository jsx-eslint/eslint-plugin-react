# Prevents usage of deprecated component lifecycle methods (react/no-deprecated-methods)

Warns if you have deprecated methods defined when defining a component that extends `React.Component`, `React.PureComponent` or uses ES5 syntax with `createReactClass`. See [React 16.3 details](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path).

## Rule Details

The following patterns are considered warnings:

```jsx
class Foo extends React.Component {
  componentWillReceiveProps() { }
  // ...
}

class Foo extends React.PureComponent {
  componentWillReceiveProps() { }
  // ...
}

var Foo = createReactClass({
  componentWillReceiveProps: function() {},
})
```

The following patterns are **not** considered warnings:

```jsx
class Foo {
    componentWillReceiveProps() {}
}

var Foo = createReactClassNonReact({
    componentWillReceiveProps: function() {}
});
```

## Rule Options

This rule can take options to ignore some deprecated methods.

```js
...
"react/no-deprecated-methods": [<enabled>, {
  "componentWillMount": <boolean>,
  "componentWillReceiveProps": <boolean>,
  "componentWillUpdate": <boolean>,
}]
...
```

* `componentWillMount`: `true` by default.
* `componentWillReceiveProps`: `true` by default.
* `componentWillUpdate`: `true` by default.