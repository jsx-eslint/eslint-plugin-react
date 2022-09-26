# react/jsx-no-leaked-render

📝 Disallow problematic leaked values from being rendered.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Using the `&&` operator to render some element conditionally in JSX can cause unexpected values being rendered, or even crashing the rendering.

## Rule Details

This rule aims to prevent dangerous leaked values from being rendered since they can cause unexpected values reaching the final DOM or even crashing your render method.

In React, you might end up rendering unexpected values like `0` or `NaN`. In React Native, your render method will even crash if you render these values:

```jsx
const Example = () => {
  return (
    <>
      {0 && <Something />}
      {/* React: renders undesired 0 */}
      {/* React Native: crashes 💥 */}

      {NaN && <Something />}
      {/* React: renders undesired NaN */}
      {/* React Native: crashes 💥 */}

      {'' && <Something />}
      {/* React: renders nothing */}
      {/* React Native, with React < 18: crashes 💥 */}
    </>
  )
}
```

This can be avoided by:

- coercing the conditional to a boolean: `{!!someValue && <Something />}`
- transforming the binary expression into a ternary expression which returns `null` for falsy values: `{someValue ? <Something /> : null}`

This rule is autofixable; check the Options section to read more about the different strategies available.

Examples of **incorrect** code for this rule:

```jsx
const Component = ({ count, title }) => {
  return <div>{count && title}</div>
}
```

```jsx
const Component = ({ count }) => {
  return <div>{count && <span>There are {count} results</span>}</div>
}
```

```jsx
const Component = ({ elements }) => {
  return <div>{elements.length && <List elements={elements} />}</div>
}
```

```jsx
const Component = ({ nestedCollection }) => {
  return (
    <div>
      {nestedCollection.elements.length && <List elements={nestedCollection.elements} />}
    </div>
  )
}
```

```jsx
const Component = ({ elements }) => {
  return <div>{elements[0] && <List elements={elements} />}</div>
}
```

```jsx
const Component = ({ numberA, numberB }) => {
  return <div>{(numberA || numberB) && <Results>{numberA + numberB}</Results>}</div>
}
```

```jsx
// If the condition is a boolean value, this rule will report the logical expression
// since it can't infer the type of the condition.
const Component = ({ someBool }) => {
  return <div>{someBool && <Results>{numberA + numberB}</Results>}</div>
}
```

Examples of **correct** code for this rule:

```jsx
const Component = ({ elements }) => {
  return <div>{elements}</div>
}
```

```jsx
// An OR condition it's considered valid since it's assumed as a way
// to render some fallback if the first value is falsy, not to render something conditionally.
const Component = ({ customTitle }) => {
  return <div>{customTitle || defaultTitle}</div>
}
```

```jsx
const Component = ({ elements }) => {
  return <div>There are {elements.length} elements</div>
}
```

```jsx
const Component = ({ elements, count }) => {
  return <div>{!count && 'No results found'}</div>
}
```

```jsx
const Component = ({ elements }) => {
  return <div>{!!elements.length && <List elements={elements} />}</div>
}
```

```jsx
const Component = ({ elements }) => {
  return <div>{Boolean(elements.length) && <List elements={elements} />}</div>
}
```

```jsx
const Component = ({ elements }) => {
  return <div>{elements.length > 0 && <List elements={elements} />}</div>
}
```

```jsx
const Component = ({ elements }) => {
  return <div>{elements.length ? <List elements={elements} /> : null}</div>
}
```

```jsx
const Component = ({ elements }) => {
  return <div>{elements.length ? <List elements={elements} /> : <EmptyList />}</div>
}
```

## Rule Options

The supported options are:

### `ignoreAttributes`

Boolean. When set to `true`, this option ignores all attributes except for `children` during validation, preventing false positives in scenarios where these attributes are used safely or validated internally. Default is `false`.

It can be set like:

```jsonc
{
  // ...
  "react/jsx-no-leaked-render": [<enabled>, { "ignoreAttributes": true }]
  // ...
}
```

Assuming the following options: `{ "ignoreAttributes": true }`

Examples of **incorrect** code for this rule, with the above configuration:

```jsx
function MyComponent({ value }) {
  return (
    <MyChildComponent nonChildrenProp={value && 'default'}>
      {value && <MyInnerChildComponent />}
    </MyChildComponent>
  );
}
```

Even with `ignoreAttributes: true`, `children` expressions are still checked. In the example above, `{value && <MyInnerChildComponent />}` will still be flagged.

Nested JSX children within attributes are also still checked:

```jsx
const Component = ({ enabled }) => {
  return (
    <Foo bar={
      <Something>{enabled && <MuchWow />}</Something>
    } />
  )
}
```

Here, even though `<Something>…</Something>` is inside an attribute of `<Foo>`, the `{enabled && <MuchWow />}` expression is children of `<Something>`, so it is still flagged.

Examples of **correct** code for this rule, with the above configuration:

```jsx
const Component = ({ enabled, checked }) => {
  return <CheckBox checked={enabled && checked} />
}
```

With `ignoreAttributes: true`, logical expressions in non-children attributes like `checked` are not flagged.

### `validStrategies`

An array containing `"coerce"`, `"ternary"`, or both (default: `["ternary", "coerce"]`) - Decide which strategies are considered valid to prevent leaked renders (at least 1 is required). The "coerce" option will transform the conditional of the JSX expression to a boolean. The "ternary" option transforms the binary expression into a ternary expression returning `null` for falsy values. The first option from the array will be the strategy used when autofixing, so the order of the values matters.

It can be set like:

```json5
{
  // ...
  "react/jsx-no-leaked-render": [<enabled>, { "validStrategies": ["ternary", "coerce"] }]
  // ...
}
```

Assuming the following options: `{ "validStrategies": ["ternary"] }`

Examples of **incorrect** code for this rule, with the above configuration:

```jsx
const Component = ({ count, title }) => {
  return <div>{count && title}</div>
}
```

```jsx
const Component = ({ count, title }) => {
  return <div>{!!count && title}</div>
}
```

Examples of **correct** code for this rule, with the above configuration:

```jsx
const Component = ({ count, title }) => {
  return <div>{count ? title : null}</div>
}
```

```jsx
const Component = ({ count, title, empty }) => {
  return <div>{count ? title : empty}</div>
}
```

Assuming the following options: `{ "validStrategies": ["coerce"] }`

Examples of **incorrect** code for this rule, with the above configuration:

```jsx
const Component = ({ count, title }) => {
  return <div>{count && title}</div>
}
```

```jsx
const Component = ({ count, title }) => {
  return <div>{count ? title : null}</div>
}
```

Examples of **correct** code for this rule, with the above configuration:

```jsx
const Component = ({ count, title }) => {
  return <div>{!!count && title}</div>
}
```

```jsx
const Component = ({ count, title, empty }) => {
  return <div>{count ? title : empty}</div>
}
```

## When Not To Use It

If you are working in a typed-codebase which encourages you to always use boolean conditions, this rule can be disabled.

## Further Reading

- [React docs: Inline If with Logical && Operator](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator)
- [Good advice on JSX conditionals - Beware of zero](https://thoughtspile.github.io/2022/01/17/jsx-conditionals/)
- [Twitter: rendering falsy values in React and React Native](https://twitter.com/kadikraman/status/1507654900376875011?s=21&t=elEXXbHhzWthrgKaPRMjNg)
