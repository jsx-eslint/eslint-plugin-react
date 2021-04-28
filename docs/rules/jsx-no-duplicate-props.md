# Prevent duplicate properties in JSX (react/jsx-no-duplicate-props)

Creating JSX elements with duplicate props can cause unexpected behavior in your application.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<Hello name="John" name="John" />;
```

Examples of **correct** code for this rule:

```jsx
<Hello firstname="John" lastname="Doe" />;
```

## Rule Options

```js
...
"react/jsx-no-duplicate-props": [<enabled>, { "ignoreCase": <boolean> }]
...
```

### `ignoreCase`

When `true` the rule ignores the case of the props. Default to `false`.

## When Not To Use It

If you are not using JSX then you can disable this rule.
