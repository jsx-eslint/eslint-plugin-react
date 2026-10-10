# react/no-unused-state

📝 Disallow definitions of unused state.

<!-- end auto-generated rule header -->

Warns you if you have defined a property on the state, but it is not being used anywhere.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
class MyComponent extends React.Component {
  state = { foo: 0 };
  render() {
    return <SomeComponent />;
  }
}

var UnusedGetInitialStateTest = createReactClass({
  getInitialState: function() {
    return { foo: 0 };
  },
  render: function() {
    return <SomeComponent />;
  }
})
```

Examples of **correct** code for this rule:

```jsx
class MyComponent extends React.Component {
  state = { foo: 0 };
  render() {
    return <SomeComponent foo={this.state.foo} />;
  }
}

var UnusedGetInitialStateTest = createReactClass({
  getInitialState: function() {
    return { foo: 0 };
  },
  render: function() {
    return <SomeComponent foo={this.state.foo} />;
  }
})
```

## Rule Options

This rule can take one argument to ignore some specific states during validation.

```js
...
"react/no-unused-state": [<enabled>, { ignore: <ignore> }]
...
```

- `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
- `ignore`: optional array of states name to ignore during validation.
