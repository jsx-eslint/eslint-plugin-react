# Disallow multiple spaces between inline JSX props

Enforces that there is exactly one space between two JSX attributes or the JSX tag name and the first JSX attribute in the same line.

## Rule Details

The following patterns are considered warnings:

```jsx
<App  spacy />
```

```jsx
<App too  spacy />
```

The following patterns are **not** considered warnings:

```jsx
<App cozy />
```

```jsx
<App very cozy />
```

## When Not To Use It

If you are not using JSX or don't care about the space between two props in the same line.
