# Enforce that namespaces are not used in React elements (react/no-namespace)

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
