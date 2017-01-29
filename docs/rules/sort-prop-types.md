# Enforce propTypes declarations alphabetical sorting (sort-prop-types)

Some developers prefer to sort propTypes declarations alphabetically to be able to find necessary declaration easier at the later time. Others feel that it adds complexity and becomes burden to maintain.

## Rule Details

This rule checks all components and verifies that all propTypes declarations are sorted alphabetically. A spread attribute resets the verification. The default configuration of the rule is case-sensitive.

The following patterns are considered warnings:

```jsx
var Component = React.createClass({
  propTypes: {
    z: React.PropTypes.number,
    a: React.PropTypes.any,
    b: React.PropTypes.string
  },
...
});

class Component extends React.Component {
  ...
}
Component.propTypes = {
  z: React.PropTypes.number,
  a: React.PropTypes.any,
  b: React.PropTypes.string
};

class Component extends React.Component {
  static propTypes = {
    z: React.PropTypes.any,
    y: React.PropTypes.any,
    a: React.PropTypes.any
  }
  render() {
    return <div />;
  }
}
```

The following patterns are considered okay and do not cause warnings:

```jsx
var Component = React.createClass({
  propTypes: {
    a: React.PropTypes.number,
    b: React.PropTypes.any,
    c: React.PropTypes.string
  },
...
});

class Component extends React.Component {
  ...
}
Component.propTypes = {
  a: React.PropTypes.string,
  b: React.PropTypes.any,
  c: React.PropTypes.string
};

class Component extends React.Component {
  static propTypes = {
    a: React.PropTypes.any,
    b: React.PropTypes.any,
    c: React.PropTypes.any
  }
  render() {
    return <div />;
  }
}
```

## Rule Options

```js
...
"sort-prop-types": [<enabled>, {
  "callbacksLast": <boolean>,
  "ignoreCase": <boolean>,
  "requiredFirst": <boolean>,
}]
...
```

### `ignoreCase`

When `true` the rule ignores the case-sensitivity of the declarations order.

### `callbacksLast`

When `true`, propTypes for props beginning with "on" must be listed after all other props:

```js
var Component = React.createClass({
  propTypes: {
    a: React.PropTypes.number,
    z: React.PropTypes.string,
    onBar: React.PropTypes.func,
    onFoo: React.PropTypes.func,
  },
...
});
```

### `requiredFirst`

When `true`, prop types for required props must be listed before all other props:

```js
var Component = React.createClass({
  propTypes: {
    barRequired: React.PropTypes.any.isRequired,
    fooRequired: React.PropTypes.any.isRequired,
    a: React.PropTypes.number,
    z: React.PropTypes.string,
  },
...
});
```

## When not to use

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If alphabetizing props declarations isn't a part of your coding standards, then you can leave this rule off.
