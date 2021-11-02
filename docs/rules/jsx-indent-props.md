# Validate props indentation in JSX (react/jsx-indent-props)

This option validates a specific indentation style for props.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule is aimed to enforce consistent indentation style. The default style is `4 spaces`.

Examples of **incorrect** code for this rule:

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

It takes an option as the second parameter which can either be the indent mode or an object to define further settings.
The indent mode can be `"tab"` for tab-based indentation, a positive number for space indentations or `"first"` for aligning the first prop for each line with the tag's first prop.
Note that using the `"first"` option allows very inconsistent indentation unless you also enable a rule that enforces the position of the first prop.
If the second parameter is an object, it can be used to specify the indent mode as well as the option `ignoreTernaryOperator`, which causes the indent level not to be increased by a `?` or `:` operator (default is `false`).


```js
...
"react/jsx-indent-props": [<enabled>, 'tab'|<number>|'first'|<object>]
...
```

Examples of **incorrect** code for this rule:

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

Examples of **correct** code for this rule:

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

// indent level increase on ternary operator (default setting)
// [2, 2]
? <Hello
    firstName="John"
    lastName="Doe"
  />

// no indent level increase on ternary operator
// [2, { indentMode: 2, ignoreTernaryOperator: true} ]
? <Hello
  firstName="John"
  lastName="Doe"
/>
```

## When Not To Use It

If you are not using JSX then you can disable this rule.
