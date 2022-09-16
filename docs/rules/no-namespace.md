# Enforce that namespaces are not used in React elements (react/no-namespace)

💼 This rule is enabled in the following [configs](https://github.com/jsx-eslint/eslint-plugin-react#shareable-configurations): `all`.

Enforces the absence of a namespace in React elements, such as with `svg:circle`, as they are not supported in React.

## Rule Details

The following patterns are considered warnings:

```jsx
<ns:TestComponent />
```

```jsx
<Ns:TestComponent />
```

The following patterns are **not** considered warnings:

```jsx
<TestComponent />
```

```jsx
<testComponent />
```

## When Not To Use It

If you are not using React.
