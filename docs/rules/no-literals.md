# Prevent usage of unwrapped JSX strings (no-literals)

In JSX when using a literal string you can wrap it in a JXS container `{'TEXT'}`.
This rules requies that you wrap all literal strings.
Prevents any odd artifacts of highlighters if you unwrapped string contains a enclsoing character like `'` in contractions and enforces consistency.

## Rule Details

The following patterns are considered warnings:

```javascript
var Hello = <div>test</div>;
```

The following patterns are not considered:

```javascript
var Hello = <div>{'test'}</div>;
```

## When Not To Use It

If you do not want to enforce any style JSX literals, then you can disable this rule.
