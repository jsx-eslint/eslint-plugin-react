# Limit maximum of props on a single line in JSX (react/jsx-max-props-per-line)

Limiting the maximum of props on a single line can improve readability.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line. However, fix does not include indentation. Please rerun lint to correct those errors.

## Rule Details

This rule checks all JSX elements and verifies that the number of props per line do not exceed the maximum allowed. Props are considered to be in a new line if there is a line break between the start of the prop and the end of the previous prop. A spread attribute counts as one prop. This rule is off by default and when on the default maximum of props on one line is `1`.

The following patterns are considered warnings:

```jsx
<Hello lastName="Smith" firstName="John" />;

<Hello foo={{
  bar
}} baz />;
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
"react/jsx-max-props-per-line": [<enabled>, { "maximum": <number>, "when": <string> }]
...
```

### `maximum`

Maximum number of props allowed on a single line. Default to `1`.

The following patterns are considered warnings:

```jsx
// [1, { "maximum": 2 }]
<Hello firstName="John" lastName="Smith" tel={5555555} />;
```

The following patterns are not considered warnings:

```jsx
// [1, { "maximum": 2 }]
<Hello
  firstName="John" lastName="Smith"
  tel={5555555}
/>;
```

### `when`

Possible values:
- `always` (default) - Always check for max props per line.
- `multiline` - Only check for max props per line when jsx tag spans multiple lines.

The following patterns are considered warnings:
```jsx
// [1, { "when": "always" }]
<Hello firstName="John" lastName="Smith" />
```

The following patterns are not considered warnings:
```jsx
// [1, { "when": "multiline" }]
<Hello firstName="John" lastName="Smith" />
<Hello
  firstName="John"
  lastName="Smith"
/>
```

## When not to use

If you are not using JSX then you can disable this rule.
