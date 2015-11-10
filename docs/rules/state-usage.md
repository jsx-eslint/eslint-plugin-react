# Prevent unused state or using state that has never been set (state-usage)

When refactoring components to decouple states,
it usually happens that we forgot to change `state` into `props`.
Also, sometimes, we leave an unused state in the component.


## Rule Details

This rule aims to detect unused state or undeclared states.

A state field is used when referenced using `this.state.stateName`,
and a state field is considered declared when appeared in an object literal
inside `getInitialState()`

The following patterns are considered warnings:

```js
React.createClass({
  getInitialState: function () {
    return {unused: true};
  }
});
```

```js
React.createClass({
  onClick: function () {
    this.setState({unused: true});
  }
});
```

```js
React.createClass({
  render: function () {
    return <span>{this.state.undeclared}</span>
  }
});
```

The following patterns are not warnings:

```js
React.createClass({
  getInitialState: function () {
    return {used: true};
  },
  render: function () {
    return <span>{this.state.used}</span>
  }
});
```

## When Not To Use It

You should not use this if you are using any of these:

- Non-deterministic state:

  ```js
  getInitialState: function () {
    return getStateFromStore();
  }
  ```

  ```js
  getInitialState: function () {
    return Object.assign({a: 1}, getExtraState());
  }
  ```

- Non-identifier state keys:

  ```js
  getInitialState: function () {
    return {
      'quotes': false,
      ['computed']: false,
    };
  }
  ```

  ```js
  render: function () {
    return <span>{this.state['quotes']}</span>;
  }
  ```

  ```js
  render: function () {
    return <span>{this.state[getStateKeyForWhateverUnexplainedReason()]}</span>;
  }
  ```
