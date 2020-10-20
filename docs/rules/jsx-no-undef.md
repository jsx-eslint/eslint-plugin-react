# Disallow undeclared variables in JSX (react/jsx-no-undef)

This rule helps locate potential ReferenceErrors resulting from misspellings or missing components.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<Hello name="John" />;
```

```jsx
// will ignore Text in the global scope and warn
var Hello = React.createClass({
  render: function() {
    return <Text>Hello</Text>;
  }
});
module.exports = Hello;
```


Examples of **correct** code for this rule:

```jsx
var Hello = require('./Hello');

<Hello name="John" />;
```

## Rule Options

```js
...
"react/jsx-no-undef": [<enabled>, { "allowGlobals": <boolean> }]
...
```

### `allowGlobals`

When `true` the rule will consider the global scope when checking for defined Components.

Examples of **correct** code for this rule, when `"allowGlobals"` is `true`:

```jsx
var Text = require('./Text');
var Hello = React.createClass({
  render: function() {
    return <Text>Hello</Text>;
  }
});
module.exports = Hello;
```

## When Not To Use It

If you are not using JSX then you can disable this rule.
