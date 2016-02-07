# Validate spacing before closing bracket in JSX (jsx-space-before-closing)

Enforce a space before the closing bracket of self-closing JSX elements.

## Rule Details

This rule checks if there is one or more spaces before the closing bracket of self-closing JSX elements.

The following patterns are considered warnings:

```js
<Hello/>
<Hello firstname="John"/>
```

The following patterns are not considered warnings:

```js
<Hello />
<Hello firstName="John" />
<Hello
  firstName="John"
  lastName="Smith"
/>
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing before closing brackets.
