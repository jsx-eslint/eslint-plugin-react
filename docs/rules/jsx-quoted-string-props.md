# Prevent using string only property expressions in JSX (react/jsx-quoted-string-props)

This rule enforces consistent usage of JSX properties with string values.

## Rule Details

In JSX, you can use quotes to specify attributes with string values, or curly braces with expressions that may return any data type. That is, there are two ways of specifying string values, either `name="value"` or `name={'value'}`. This rule requires the usage of quotes for attributes with string values.

The following patterns is considered a warnings:

```jsx
<div id={'foobar'} />
```

The following pattern is **not** considered a warning:

```jsx
<div id="foobar" />
```

## When Not To Use It

This rule is a formatting preference. If consistent string attribute values are not part of your coding standards, then you can leave this rule off.
