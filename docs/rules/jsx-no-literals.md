# Prevent usage of unwrapped JSX strings (react/jsx-no-literals)

In JSX when using a literal string you can wrap it in a JSX container `{'TEXT'}`.
This rules requires that you wrap all literal strings.
Prevents any odd artifacts of highlighters if your unwrapped string contains an enclosing character like `'` in contractions and enforces consistency.

## Rule Details

The following patterns are considered warnings:

```jsx
var Hello = <div>test</div>;
```

The following patterns are not considered warnings:

```jsx
var Hello = <div>{'test'}</div>;
```

## When Not To Use It

If you do not want to enforce any style JSX literals, then you can disable this rule.
