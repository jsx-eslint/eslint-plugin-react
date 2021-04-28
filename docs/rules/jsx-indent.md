# Validate JSX indentation (react/jsx-indent)

This option validates a specific indentation style for JSX.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.
Fixer will fix whitespace and tabs indentation.

## Rule Details

This rule is aimed to enforce consistent indentation style. The default style is `4 spaces`.

Examples of **incorrect** code for this rule:

```jsx
// 2 spaces indentation
<App>
  <Hello />
</App>

// no indentation
<App>
<Hello />
</App>

// 1 tab indentation
<App>
  <Hello />
</App>
```

## Rule Options

It takes an option as the second parameter which can be `"tab"` for tab-based indentation or a positive number for space indentations.
To enable checking the indentation of attributes or add indentation to logical expressions, use the third parameter to turn on the `checkAttributes` (default is false) and `indentLogicalExpressions` (default is false) respectively.

```js
...
"react/jsx-indent": [<enabled>, 'tab'|<number>, {checkAttributes: <boolean>, indentLogicalExpressions: <boolean>}]
...
```

Examples of **incorrect** code for this rule:

```jsx
// 2 spaces indentation
// [2, 2]
<App>
    <Hello />
</App>

// tab indentation
// [2, 'tab']
<App>
  <Hello />
</App>

// [2, 2, {checkAttributes: true}]
<App render={
  <Hello render={
    (bar) => <div>hi</div>
}
  />
  }>
</App>

// [2, 2, {indentLogicalExpressions: true}]
<App>
  {condition && (
  <Hello />
  )}
</App>
```

Examples of **correct** code for this rule:

```jsx

// 2 spaces indentation
// [2, 2]
<App>
  <Hello />
</App>

// tab indentation
// [2, 'tab']
<App>
  <Hello />
</App>

// no indentation
// [2, 0]
<App>
<Hello />
</App>

// [2, 2, {checkAttributes: false}]
<App render={
  <Hello render={
    (bar) => <div>hi</div>
}
  />
  }>
</App>

// [2, 2, {indentLogicalExpressions: true}]
<App>
  {condition && (
    <Hello />
  )}
</App>
```

## When not to use

If you are not using JSX then you can disable this rule.
