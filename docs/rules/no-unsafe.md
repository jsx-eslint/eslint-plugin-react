# Prevent usage of `UNSAFE_` methods (react/no-unsafe)

Certain legacy lifecycle methods are [unsafe for use in async React applications][async_rendering] and cause warnings in [_strict mode_][strict_mode]. These also happen to be the lifecycles that cause the most [confusion within the React community][component_lifecycle_changes].

[async_rendering]: https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
[strict_mode]: https://reactjs.org/docs/strict-mode.html#identifying-unsafe-lifecycles
[component_lifecycle_changes]: https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

The rule checks the following methods: `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, `UNSAFE_componentWillUpdate`.

## Rule Details

The following patterns are considered warnings:

```jsx
class Foo extends React.Component {
  UNSAFE_componentWillMount() {}
  UNSAFE_componentWillReceiveProps() {}
  UNSAFE_componentWillUpdate() {}
}
```

```jsx
const Foo = createReactClass({
  UNSAFE_componentWillMount: function() {},
  UNSAFE_componentWillReceiveProps: function() {},
  UNSAFE_componentWillUpdate: function() {}
});
```

The following patterns are **not** considered warnings:

```jsx
class Foo extends Bar {
  UNSAFE_componentWillMount() {}
  UNSAFE_componentWillReceiveProps() {}
  UNSAFE_componentWillUpdate() {}
}
```

```jsx
const Foo = bar({
  UNSAFE_componentWillMount: function() {},
  UNSAFE_componentWillReceiveProps: function() {},
  UNSAFE_componentWillUpdate: function() {}
});
```
