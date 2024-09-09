# Disallow usage of dangerous JSX properties (`react/no-danger`)

<!-- end auto-generated rule header -->

Dangerous properties in React are those whose behavior is known to be a common source of application vulnerabilities. The properties' names clearly indicate they are dangerous and should be avoided unless great care is taken.

See <https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html>

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var React = require('react');

var Hello = <div dangerouslySetInnerHTML={{ __html: "Hello World" }}></div>;
```

Examples of **correct** code for this rule:

```jsx
var React = require('react');

var Hello = <div>Hello World</div>;
```

## Rule Options

```js
...
"react/no-danger": [<enabled>, {
  "customComponentNames": Array<string>,
}]
...
```

### customComponentNames

Defaults to `[]`, if you want to enable this rule for all custom components you can pass `customComponentNames` as `['*']`, or else you can pass specific components name to the array.

## When Not To Use It

If you are certain the content passed to dangerouslySetInnerHTML is sanitized HTML you can disable this rule.
