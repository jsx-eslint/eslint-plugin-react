# Validate props indentation in JSX (react/jsx-indent-props)

This option validates a specific indentation style for props.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule is aimed to enforce consistent indentation style. The default style is `4 spaces`.

The following patterns are considered warnings:

```jsx
// 2 spaces indentation
<Hello
  firstName="John"
/>

// no indentation
<Hello
firstName="John"
/>

// 1 tab indentation
<Hello
  firstName="John"
/>
```

## Rule Options

It takes an option as the second parameter which can be `"tab"` for tab-based indentation or a positive number for space indentations.

```js
...
"react/jsx-indent-props": [<enabled>, 'tab'|<number>]
...
```

The following patterns are considered warnings:

```jsx
// 2 spaces indentation
// [2, 2]
<Hello
    firstName="John"
/>

// tab indentation
// [2, 'tab']
<Hello
  firstName="John"
/>
```

The following patterns are **not** warnings:

```jsx

// 2 spaces indentation
// [2, 2]
<Hello
  firstName="John"
/>

<Hello
  firstName="John" />

// tab indentation
// [2, 'tab']
<Hello
  firstName="John"
/>

// no indentation
// [2, 0]
<Hello
firstName="John"
/>
```

## When not to use

If you are not using JSX then you can disable this rule.
