# Prevent duplicate properties in JSX (jsx-no-duplicate-props)

Creating JSX elements with duplicate props can cause unexpected behavior in your application.

## Rule Details

The following patterns are considered warnings:

```js
<Hello name="John" name="John" />;
```

The following patterns are not considered warnings:

```js
<Hello firstname="John" lastname="Doe" />;
```

## Rule Options

```js
...
"jsx-no-duplicate-props": [<enabled>, { "ignoreCase": <boolean> }]
...
```

### `ignoreCase`

When `true` the rule ignores the case of the props. Default to `false`.

## When Not To Use It

If you are not using JSX then you can disable this rule.
