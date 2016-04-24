# Limit maximum of props on a single line in JSX (jsx-max-props-per-line)

Limiting the maximum of props on a single line can improve readability.

## Rule Details

This rule checks all JSX elements and verifies that the number of props per line do not exceed the maximum allowed. A spread attribute counts as one prop. This rule is off by default and when on the default maximum of props on one line is `1`.

The following patterns are considered warnings:

```jsx
<Hello lastName="Smith" firstName="John" />;
```

The following patterns are not considered warnings:

```jsx
<Hello
  firstName="John"
  lastName="Smith"
/>;

<Hello
  {...this.props}
  firstName="John"
  lastName="Smith"
/>;
```

## Rule Options

```js
...
"jsx-max-props-per-line": [<enabled>, { "maximum": <number> }]
...
```

### `maximum`

Maximum number of props allowed on a single line. Default to `1`.

The following patterns are considered warnings:

```jsx
// [1, {maximum: 2}]
<Hello firstName="John" lastName="Smith" tel={5555555} />;
```

The following patterns are not considered warnings:

```jsx
// [1, {maximum: 2}]
<Hello
  firstName="John" lastName="Smith"
  tel={5555555}
/>;
```

## When not to use

If you are not using JSX then you can disable this rule.
