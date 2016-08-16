# Validate spacing before closing bracket in JSX (jsx-space-before-closing)

Enforce or forbid spaces before the closing bracket of self-closing JSX elements.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule checks if there is one or more spaces before the closing bracket of self-closing JSX elements.

This rule takes one argument. If it is `"always"` then it warns whenever a space is missing before the closing bracket. If `"never"` then it warns if a space is present before the closing bracket. The default value of this option is `"always"`.

The following patterns are considered warnings when configured `"always"`:

```js
<Hello/>
<Hello firstname="John"/>
```

The following patterns are not considered warnings when configured `"always"`:

```js
<Hello />
<Hello firstName="John" />
<Hello
  firstName="John"
  lastName="Smith"
/>
```

The following patterns are considered warnings when configured `"never"`:

```js
<Hello />
<Hello firstName="John" />
```

The following patterns are not considered warnings when configured `"never"`:

```js
<Hello/>
<Hello firstname="John"/>
<Hello
  firstName="John"
  lastName="Smith"
/>
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing before closing brackets.
