# Require or prevent a new line after jsx elements and expressions (`react/jsx-newline`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This is a stylistic rule intended to make JSX code more readable by requiring or preventing lines between adjacent JSX elements and expressions.

## Rule Options

```json5
...
"react/jsx-newline": [<enabled>, { "prevent": <boolean>, "allowMultilines": <boolean> }]
...
```

- enabled: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
- prevent: optional boolean. If `true` prevents empty lines between adjacent JSX elements and expressions. Defaults to `false`.
- allowMultilines: optional boolean. If `true` and `prevent` is also equal to `true`, it allows newlines after multiline JSX elements and expressions. Defaults to `false`.

## Examples

Examples of **incorrect** code for this rule, when configured with `{ "prevent": false }`:

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

Examples of **correct** code for this rule, when configured with `{ "prevent": false }`:

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

Examples of **incorrect** code for this rule, when configured with `{ "prevent": true }`:

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

Examples of **correct** code for this rule, when configured with `{ "prevent": true }`:

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

Examples of **incorrect** code for this rule, when configured with `{ "prevent": true, "allowMultilines": true }`:

```jsx
<div>
  {showSomething === true && <Something />}

  <Button>Button 3</Button>
  {showSomethingElse === true ? (
    <SomethingElse />
  ) : (
    <ErrorMessage />
  )}
</div>
```

Examples of **correct** code for this rule, when configured with `{ "prevent": true, "allowMultilines": true }`:

```jsx
<div>
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
