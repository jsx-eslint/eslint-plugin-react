# Enforce propTypes declarations alphabetical sorting (react/sort-prop-types)

Some developers prefer to sort propTypes declarations alphabetically to be able to find necessary declaration easier at the later time. Others feel that it adds complexity and becomes burden to maintain.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.


## Rule Details

This rule checks all components and verifies that all propTypes declarations are sorted alphabetically. A spread attribute resets the verification. The default configuration of the rule is case-sensitive.

The following patterns are considered warnings:

```jsx
var Component = createReactClass({
  propTypes: {
    z: PropTypes.number,
    a: PropTypes.any,
    b: PropTypes.string
  },
...
});

class Component extends React.Component {
  ...
}
Component.propTypes = {
  z: PropTypes.number,
  a: PropTypes.any,
  b: PropTypes.string
};

class Component extends React.Component {
  static propTypes = {
    z: PropTypes.any,
    y: PropTypes.any,
    a: PropTypes.any
  }
  render() {
    return <div />;
  }
}
```

The following patterns are considered okay and do **not** cause warnings:

```jsx
var Component = createReactClass({
  propTypes: {
    a: PropTypes.number,
    b: PropTypes.any,
    c: PropTypes.string
  },
...
});

class Component extends React.Component {
  ...
}
Component.propTypes = {
  a: PropTypes.string,
  b: PropTypes.any,
  c: PropTypes.string
};

class Component extends React.Component {
  static propTypes = {
    a: PropTypes.any,
    b: PropTypes.any,
    c: PropTypes.any
  }
  render() {
    return <div />;
  }
}
```

## Rule Options

```js
...
"react/sort-prop-types": [<enabled>, {
  "callbacksLast": <boolean>,
  "ignoreCase": <boolean>,
  "requiredFirst": <boolean>,
  "sortShapeProp": <boolean>,
  "noSortAlphabetically": <boolean>
}]
...
```

### `ignoreCase`

When `true` the rule ignores the case-sensitivity of the declarations order.

### `callbacksLast`

When `true`, propTypes for props beginning with "on" must be listed after all other props:

```js
var Component = createReactClass({
  propTypes: {
    a: PropTypes.number,
    z: PropTypes.string,
    onBar: PropTypes.func,
    onFoo: PropTypes.func,
  },
...
});
```

### `requiredFirst`

When `true`, prop types for required props must be listed before all other props:

```js
var Component = createReactClass({
  propTypes: {
    barRequired: PropTypes.any.isRequired,
    fooRequired: PropTypes.any.isRequired,
    a: PropTypes.number,
    z: PropTypes.string,
  },
...
});
```

### `sortShapeProp`

When `true`, props defined in `PropTypes.shape` must be sorted via the same rules as the top-level props:

```js
var Component = createReactClass({
  propTypes: {
    a: PropTypes.number,
    b: PropTypes.shape({
      d: PropTypes.number,
      e: PropTypes.func,
      f: PropTypes.bool,
    }),
    c: PropTypes.string,
  },
...
});
```
### `noSortAlphabetically`

When `true`, alphabetical order is not enforced:

```js
var Component = createReactClass({
  propTypes: {
    barRequired: PropTypes.any.isRequired,
    z: PropTypes.string,
    a: PropTypes.number,
  },
...
});
```

## When not to use

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If alphabetizing props declarations isn't a part of your coding standards, then you can leave this rule off.
