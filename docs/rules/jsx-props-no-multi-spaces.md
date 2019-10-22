# Disallow multiple spaces between inline JSX props (react/jsx-props-no-multi-spaces)

Enforces that there is exactly one space between all attributes and after tag name and the first attribute in the same line.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

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

If you have enabled the core rule `no-multi-spaces` with eslint >= 3, you don't need this rule.
