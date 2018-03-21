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

It takes an option as the second parameter which can be `"tab"` for tab-based indentation, a positive number for space indentations or `"first"` for aligning the first prop for each line with the tag's first prop.
Note that using the `"first"` option allows very inconsistent indentation unless you also enable a rule that enforces the position of the first prop.

```js
...
"react/jsx-indent-props": [<enabled>, 'tab'|<number>|'first']
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

// aligned with first prop
// [2, 'first']
<Hello
  firstName="John"
    lastName="Doe"
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

// aligned with first prop
// [2, 'first']
<Hello
  firstName="John"
  lastName="Doe"
/>

<Hello
       firstName="John"
       lastName="Doe"
/>

<Hello firstName="Jane"
       lastName="Doe" />
```

## When not to use

If you are not using JSX then you can disable this rule.
