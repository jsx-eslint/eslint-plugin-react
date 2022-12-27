# Enforce spacing before closing bracket in JSX (`react/jsx-space-before-closing`)

❌ This rule is deprecated. It was replaced by [`react/jsx-tag-spacing`](jsx-tag-spacing.md).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Please use the `"beforeSelfClosing"` option of the [jsx-tag-spacing](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-tag-spacing.md) rule instead.

Enforce or forbid spaces before the closing bracket of self-closing JSX elements.

## Rule Details

This rule checks if there is one or more spaces before the closing bracket of self-closing JSX elements.

## Rule Options

This rule takes one argument. If it is `"always"` then it warns whenever a space is missing before the closing bracket. If `"never"` then it warns if a space is present before the closing bracket. The default value of this option is `"always"`.

Examples of **incorrect** code for this rule, when configured with `"always"`:

```jsx
<Hello/>
<Hello firstname="John"/>
```

Examples of **correct** code for this rule, when configured with `"always"`:

```jsx
<Hello />
<Hello firstName="John" />
<Hello
  firstName="John"
  lastName="Smith"
/>
```

Examples of **incorrect** code for this rule, when configured with `"never"`:

```jsx
<Hello />
<Hello firstName="John" />
```

Examples of **correct** code for this rule, when configured with `"never"`:

```jsx
<Hello/>
<Hello firstname="John"/>
<Hello
  firstName="John"
  lastName="Smith"
/>
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing before closing brackets.
