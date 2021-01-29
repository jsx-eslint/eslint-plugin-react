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

Examples of **incorrect** code for this rule:

```jsx
class Foo extends React.Component {
  state = { bar: 0 }
  render() {
    return <div>Foo</div>
  }
}
```

Examples of **correct** code for this rule:

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

Examples of **incorrect** code for this rule:

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

Examples of **correct** code for this rule:

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
