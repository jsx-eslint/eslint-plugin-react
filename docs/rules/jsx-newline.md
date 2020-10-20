# Enforce a new line after jsx elements and expressions (react/jsx-newline)

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This is a stylistic rule intended to make JSX code more readable by enforcing spaces between adjacent JSX elements and expressions.

Examples of **incorrect** code for this rule:

```jsx
<div>
  <Button>{data.label}</Button>
  <List />
</div>
```

```jsx
<div>
  <Button>{data.label}</Button>
  {showSomething === true && <Something />}
</div>
```

```jsx
<div>
  {showSomething === true && <Something />}
  {showSomethingElse === true ? (
    <SomethingElse />
  ) : (
    <ErrorMessage />
  )}
</div>
```

Examples of **correct** code for this rule:

```jsx
<div>
  <Button>{data.label}</Button>

  <List />

  <Button>
    <IconPreview />
    Button 2

    <span></span>
  </Button>

  {showSomething === true && <Something />}

  <Button>Button 3</Button>

  {showSomethingElse === true ? (
    <SomethingElse />
  ) : (
    <ErrorMessage />
  )}
</div>
```

## When Not To Use It

You can turn this rule off if you are not concerned with spacing between your JSX elements and expressions.