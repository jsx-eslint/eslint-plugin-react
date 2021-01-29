# One JSX Element Per Line (react/jsx-one-expression-per-line)

This option limits every line in JSX to one expression each.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.
Fixer will insert line breaks between any expression that are on the same line.

## Rule Details

Examples of **incorrect** code for this rule:

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

Examples of **correct** code for this rule:

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

Examples of **correct** code for this rule, when configured as `"literal"`:

```jsx
<App>Hello</App>
```

Examples of **correct** code for this rule, when configured as `"single-child"`:

```jsx
<App>Hello</App>

<App>{"Hello"}</App>

<App><Hello /></App>
```
