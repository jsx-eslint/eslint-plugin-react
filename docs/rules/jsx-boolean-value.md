# Enforce boolean attributes notation in JSX (`react/jsx-boolean-value`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

[When using a boolean attribute in JSX](https://facebook.github.io/react/docs/jsx-in-depth.html#boolean-attributes), you can set the attribute value to `true` or omit the value.

## Rule Details

This rule will enforce one or the other to keep consistency in your code.

## Rule Options

This rule takes two arguments. If the first argument is `"always"` then it warns whenever an attribute is missing its value. If `"never"` then it warns if an attribute has a `true` value. The default value of this option is `"never"`.

The second argument is optional: if provided, it must be an object with a `"never"` property (if the first argument is `"always"`), or an `"always"` property (if the first argument is `"never"`). This property’s value must be an array of strings representing prop names.

Examples of **incorrect** code for this rule, when configured with `"never"`, or with `"always", { "never": ["personal"] }`:

```jsx
var Hello = <Hello personal={true} />;
```

Examples of **correct** code for this rule, when configured with `"never"`, or with `"always", { "never": ["personal"] }`:

```jsx
var Hello = <Hello personal />;
```

Examples of **incorrect** code for this rule, when configured with `"always"`, or with `"never", { "always": ["personal"] }`:

```jsx
var Hello = <Hello personal />;
```

Examples of **correct** code for this rule, when configured with `"always"`, or with `"never", { "always": ["personal"] }`:

```jsx
var Hello = <Hello personal={true} />;
```

## When Not To Use It

If you do not want to enforce any style for boolean attributes, then you can disable this rule.
