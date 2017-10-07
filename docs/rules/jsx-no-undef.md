# Disallow undeclared variables in JSX (react/jsx-no-undef)

This rule helps locate potential ReferenceErrors resulting from misspellings or missing components.

## Rule Details

The following patterns are considered warnings:

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


The following patterns are **not** considered warnings:

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

The following patterns are considered okay and do **not** cause warnings:

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
