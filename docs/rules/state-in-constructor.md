# Enforce state initialization style (react/state-in-constructor)

This rule will enforce the state initialization style to be either in a constructor or with a class property.

## Rule Options

```js
...
"react/state-in-constructor": [<enabled>, <mode>]
...
```

### `always` mode

Will enforce the state initialization style to be in a constructor. This is the default mode.

The following patterns are considered warnings:

```jsx
class Foo extends React.Component {
  state = { bar: 0 }
  render() {
    return <div>Foo</div>
  }
}
```

The following patterns are **not** considered warnings:

```jsx
class Foo extends React.Component {
  constructor(props) {
    super(props)
    this.state = { bar: 0 }
  }
  render() {
    return <div>Foo</div>
  }
}
```

### `never` mode

Will enforce the state initialization style to be with a class property.

The following patterns are considered warnings:

```jsx
class Foo extends React.Component {
  constructor(props) {
    super(props)
    this.state = { bar: 0 }
  }
  render() {
    return <div>Foo</div>
  }
}
```

The following patterns are **not** considered warnings:

```jsx
class Foo extends React.Component {
  state = { bar: 0 }
  render() {
    return <div>Foo</div>
  }
}
```


## When Not To Use It

When the way a component state is being initialized doesn't matter.
