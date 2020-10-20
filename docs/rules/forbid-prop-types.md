# Forbid certain propTypes (react/forbid-prop-types)

By default this rule prevents vague prop types with more specific alternatives available (`any`, `array`, `object`), but any prop type can be disabled if desired. The defaults are chosen because they have obvious replacements. `any` should be replaced with, well, anything. `array` and `object` can be replaced with `arrayOf` and `shape`, respectively.

## Rule Details

This rule checks all JSX components and verifies that no forbidden propsTypes are used.
This rule is off by default.

Examples of **incorrect** code for this rule:

```jsx
var Component = createReactClass({
  propTypes: {
    a: PropTypes.any,
    r: PropTypes.array,
    o: PropTypes.object
  },
...
});

class Component extends React.Component {
  ...
}
Component.propTypes = {
  a: PropTypes.any,
  r: PropTypes.array,
  o: PropTypes.object
};

class Component extends React.Component {
  static propTypes = {
    a: PropTypes.any,
    r: PropTypes.array,
    o: PropTypes.object
  }
  render() {
    return <div />;
  }
}
```

## Rule Options

```js
...
"react/forbid-prop-types": [<enabled>, { "forbid": [<string>], "checkContextTypes": <boolean>, "checkChildContextTypes": <boolean> }]
...
```

### `forbid`

An array of strings, with the names of `PropTypes` keys that are forbidden. The default value for this option is `['any', 'array', 'object']`.

### `checkContextTypes`

Whether or not to check `contextTypes` for forbidden prop types. The default value is `false`.

### `checkChildContextTypes`

Whether or not to check `childContextTypes` for forbidden prop types. The default value is `false`.

## When not to use

This rule is a formatting/documenting preference and not following it won't negatively affect the quality of your code. This rule encourages prop types that more specifically document their usage.
