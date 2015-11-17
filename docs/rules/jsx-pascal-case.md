# Enforce PasalCase for user-defined JSX components (jsx-pascal-case)

Enforces coding style that user-defined JSX components are defined and referenced in PascalCase.

## Rule Details

The following patterns are considered warnings:

```js
<testComponent />
```

```js
<testComponent>
  <div />
</testComponent>
```

```js
<test_component />
```

The following patterns are not considered warnings:

```js
<TestComponent />
```

```js
<TestComponent>
  <div />
</TestComponent>
```

## When Not To Use It

If you are not using JSX.