# One JSX Element Per Line (react/jsx-one-expression-per-line)

This option limits every line in JSX to one expression each.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.
Fixer will insert line breaks between any expression that are on the same line.

## Rule Details

The following patterns are considered warnings:

```jsx
<App><Hello /></App>

<App><Hello />
</App>

<App>
  <Hello>
  </Hello></App>

<App>
  <Hello /> World
</App>

<App>
  <Hello /> { 'World' }
</App>

<App>
  <Hello /> { this.world() }
</App>

<App>
  { 'Hello' }{ ' ' }{ 'World' }
</App>

<App
  foo
><Hello />
</App>

<App><Hello
  foo
/>
</App>

<App><Hello1 />
     <Hello2 />
     <Hello3 />
</App>
```

The following patterns are **not** warnings:

```jsx
<App>
  <Hello />
</App>

<App>
  <Hello>
  </Hello>
</App>

<App>
  <Hello />
  World
</App>

<App>
  <Hello />
  { 'World' }
</App>

<App>
  <Hello />
  { this.world() }
</App>

<App>
  { 'Hello' }
  { ' ' }
  { 'World' }
</App>

<App
  foo
>
  <Hello />
</App>

<App>
  <Hello
    foo
  />
</App>

<App>
  <Hello1 />
  <Hello2 />
  <Hello3 />
</App>
```

## Rule Options

```js
...
"react/jsx-one-expression-per-line": [<enabled>, { "allow": "none"|"literal"|"single-child" }]
...
```

### `allow`

Defaults to `none`.

The following pattern is **not** considered a warning when configured as `"literal"`:

```jsx
<App>Hello</App>
```

The following patterns are **not** considered warnings when configured as `"single-child"`:

```jsx
<App>Hello</App>

<App>{"Hello"}</App>

<App><Hello /></App>
```
