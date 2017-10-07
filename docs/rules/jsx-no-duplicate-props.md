# Prevent duplicate properties in JSX (react/jsx-no-duplicate-props)

Creating JSX elements with duplicate props can cause unexpected behavior in your application.

## Rule Details

The following patterns are considered warnings:

```jsx
<Hello name="John" name="John" />;
```

The following patterns are **not** considered warnings:

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
