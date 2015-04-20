# Enforce propTypes declarations alphabetical sorting (jsx-sort-prop-types)

Some developers prefer to sort propsTypes declarations alphabetically to be able to find necessary declaration easier at the later time. Others feel that it adds complexity and becomes burden to maintain.

## Rule Details

This rule checks all JSX components and verifies that all propsTypes declarations are sorted alphabetically.
The default configuration of the rule is case-sensitive.
This rule is off by default.

The following patterns are considered warnings:

```js
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

```js
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
"jsx-sort-prop-types": [<enabled>, { "ignoreCase": <boolean> }]
...
```

### `ignoreCase`

When `true` the rule ignores the case-sensitivity of the declarations order.

## When not to use

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If alphabetizing props declarations isn't a part of your coding standards, then you can leave this rule off.
