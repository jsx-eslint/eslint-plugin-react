# react/lifecycle-param-names

📝 Enforce the conventional parameter names of lifecycle methods.

<!-- end auto-generated rule header -->

Lifecycle method parameters should use the names from the React documentation. For example, the first parameter of `componentDidUpdate` holds the previous props, so naming it `props` makes it easy to confuse with `this.props`.

The expected names are:

- `constructor(props)`
- `static getDerivedStateFromProps(props, state)`
- `static getDerivedStateFromError(error)`
- `shouldComponentUpdate(nextProps, nextState)`
- `getSnapshotBeforeUpdate(prevProps, prevState)`
- `componentDidUpdate(prevProps, prevState, snapshot)`
- `componentDidCatch(error, info)`
- `componentWillReceiveProps(nextProps)` and `UNSAFE_componentWillReceiveProps(nextProps)`
- `componentWillUpdate(nextProps, nextState)` and `UNSAFE_componentWillUpdate(nextProps, nextState)`

Only parameters that are plain identifiers are checked; destructured and rest parameters are ignored.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
class Foo extends React.Component {
  componentDidUpdate(props) {}

  shouldComponentUpdate(prevProps, nextState) {}
}
```

Examples of **correct** code for this rule:

```jsx
class Foo extends React.Component {
  componentDidUpdate(prevProps) {}

  shouldComponentUpdate(nextProps, nextState) {}
}

class Bar extends React.Component {
  componentDidUpdate({ value }, { open }) {}
}
```
