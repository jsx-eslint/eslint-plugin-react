# Disallow undeclared variables in JSX (`react/jsx-no-undef`)

💼 This rule is enabled in the ☑️ `recommended` [config](https://github.com/jsx-eslint/eslint-plugin-react/#shareable-configs).

<!-- end auto-generated rule header -->

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

It's recommended to avoid this rule if your project:

1. does not use JSX
2. uses TypeScript, which [automatically enables better checks than ESLint `no-undef` rules](https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors)
3. uses [`typescript-eslint` with `no-undef`](https://typescript-eslint.io/play/#ts=5.7.2&fileType=.tsx&code=DwCQpgNhD2AEB2BDAtmAvAIgFLQBbw1gHoA%2BAbgCgg&eslintrc=N4KABGBEBOCuA2BTAzpAXGUEKQHYHsBaWXAE0QDN0pFpp9pJwwBfEFoA&tsconfig=N4KABGBEDGD2C2AHAlgGwKYCcDyiAuysAdgM6QBcYoEEkJemy0eAcgK6qoDCAFutAGsylBm3TgwAXxCSgA&tokens=false)
